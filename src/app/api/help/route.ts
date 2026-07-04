import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the bilingual (English/Burmese) AI Support Assistant for Mobile Shop OS. Answer questions clearly about Products, Repairs, POS, and Login/Accounts.

CRITICAL CONVERSATION RULES:
- Never re-introduce yourself ('Hello, I am AI...') if the conversation is ongoing. Jump directly into answering the user's prompt.
- Never truncate your explanation; keep it complete and helpful.

Speak naturally in English or Burmese depending on the user's language. Answer as a helpful Mobile Shop OS support assistant.`;

const FALLBACK_GENERIC = `I can help with Products, Repairs, and POS/Sales in Mobile Shop OS. Please try asking a specific question about any of these features.`;

function getGeminiErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Gemini API error";
  }
}

function shouldExposeGeminiDebug() {
  return process.env.NODE_ENV !== "production" || process.env.GEMINI_DEBUG_ERRORS === "true";
}

function getFallbackResponse(debugReason?: string) {
  let fallbackText = FALLBACK_GENERIC;

  if (debugReason && shouldExposeGeminiDebug()) {
    return `${fallbackText}\n\n[Debug] ${debugReason}`;
  }

  return fallbackText;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as unknown;
    const requestMessages: unknown[] =
      typeof body === "object" && body !== null && Array.isArray((body as any).messages)
        ? (body as any).messages
        : [];
    const prompt = String((body as any)?.prompt || "").trim();

    type ConversationMessage = {
      role: "user" | "assistant";
      content: string;
    };

    const normalizedMessages: ConversationMessage[] = requestMessages
      .filter(
        (item: unknown): item is { role: string; content?: string; text?: string } =>
          typeof item === "object" &&
          item !== null &&
          "role" in item &&
          typeof (item as any).role === "string" &&
          ((item as any).role === "user" || (item as any).role === "assistant") &&
          (typeof (item as any).content === "string" || typeof (item as any).text === "string")
      )
      .map((item) => ({
        role: (item.role as "user" | "assistant"),
        content: String(item.content ?? item.text ?? "").trim(),
      }))
      .filter((message) => message.content.length > 0);

    const conversation: ConversationMessage[] = normalizedMessages.length > 0 ? normalizedMessages : prompt ? [{ role: "user", content: prompt }] : [];

    if (conversation.length === 0) {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    const recentConversation = conversation.slice(-6);

    let liveInventoryContext = "";
    try {
      const inventory = await prisma.product.findMany({
        select: {
          name: true,
          category: true,
          price: true,
          stockQuantity: true,
        },
        take: 25,
      });

      if (inventory.length > 0) {
        const inventoryLines = inventory.map(
          (item) => `- ${item.name} (${item.category}) | Price: ${item.price} | Stock: ${item.stockQuantity}`
        );
        liveInventoryContext = `REAL-TIME NEON DATABASE INVENTORY: ${inventory.length} items currently in stock.\n${inventoryLines.join("\n")}\nWhen users ask about current stock, prices, or inventory items, list them directly and accurately using THIS live data. Always refer strictly to this real-time stock and pricing.`;
      }
    } catch (dbError) {
      console.error("Live inventory query failed:", dbError);
      liveInventoryContext = "";
    }

    const systemInstruction = liveInventoryContext
      ? `${liveInventoryContext}\n\n${SYSTEM_PROMPT}`
      : SYSTEM_PROMPT;

    const formattedHistory = [
      {
        role: "system",
        parts: [{ text: systemInstruction }],
      },
      ...recentConversation.map((message) => ({
        role: message.role === "assistant" ? "model" : message.role,
        parts: [{ text: message.content }],
      })),
    ];

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    let answer = "";

    if (geminiKey) {
      try {
        const client = new GoogleGenAI({ apiKey: geminiKey });
        const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
        let lastGeminiError: unknown;

        for (const model of models) {
          try {
            const response = await client.models.generateContent({
              model,
              contents: formattedHistory,
              config: {
                systemInstruction,
                temperature: 0.8,
                maxOutputTokens: 2048,
              },
            });

            answer = response.text?.trim() ?? "";
            break;
          } catch (error) {
            lastGeminiError = error;
            console.error("Gemini API Error:", error);
          }
        }

        if (!answer) {
          answer = getFallbackResponse(
            getGeminiErrorMessage(lastGeminiError)
          );
        }
      } catch (error) {
        console.error("Gemini API Error:", error);
        answer = getFallbackResponse(
          getGeminiErrorMessage(error)
        );
      }
    } else {
      answer = getFallbackResponse(
        "Missing GEMINI_API_KEY"
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Help API Error:", error);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
