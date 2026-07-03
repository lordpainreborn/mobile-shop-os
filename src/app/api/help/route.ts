import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the bilingual (English/Burmese) AI Support Assistant for Mobile Shop OS. Answer questions clearly about Products, Repairs, POS, and Login/Accounts.

CRITICAL CONVERSATION RULES:
- Never re-introduce yourself ('Hello, I am AI...') if the conversation is ongoing. Jump directly into answering the user's prompt.
- Never truncate your explanation; keep it complete and helpful.

Speak naturally in English or Burmese depending on the user's language. Answer as a helpful Mobile Shop OS support assistant.`;

const fallbackResponses: Record<string, string> = {
  addProduct: `Products Page Tutorial:
1. Go to Products.
2. Click "Add Product".
3. Fill in product name, category, cost, selling price, and stock quantity.
4. Save to add it to inventory.
5. Use the edit and delete buttons to maintain product records.`,
  repairTicket: `Repairs Page Guide:
1. Open Repairs.
2. Click "New Ticket".
3. Enter customer details, device model, issue, and estimate cost.
4. Save the ticket and advance the status as work progresses.`,
  posGuide: `POS / Sales Guide:
1. Open Sales.
2. Search or scan a product.
3. Add products to the cart and confirm quantities.
4. Choose a payment method, then checkout to record the sale and update stock.`,
};

const queryMap: { keywords: string[]; key: keyof typeof fallbackResponses }[] = [
  { keywords: ["product", "inventory", "stock", "add product", "edit product", "delete product"], key: "addProduct" },
  { keywords: ["repair", "ticket", "estimate", "status", "device issue", "service"], key: "repairTicket" },
  { keywords: ["pos", "sales", "checkout", "cart", "transaction"], key: "posGuide" },
];

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

async function getFallbackResponse(message: string, debugReason?: string) {
  const normalized = message.trim().toLowerCase();
  let fallbackText = "";

  for (const { keywords, key } of queryMap) {
    if (keywords.some((word) => normalized.includes(word))) {
      fallbackText = fallbackResponses[key];
      break;
    }
  }

  if (!fallbackText) {
    fallbackText = `Hello! I am your Mobile Shop OS assistant. I can help with:
- Products page guidance
- Repairs page tickets and status updates
- POS sales checkout workflows

If the AI cannot answer, please contact admin:
Telegram: @LordPainReborn | Phone: +959961089869`;
  }

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
        where: { stockQuantity: { gt: 0 } },
        select: {
          name: true,
          price: true,
          stockQuantity: true,
        },
        take: 20,
      });

      if (inventory.length > 0) {
        const inventoryLines = inventory.map(
          (item) => `- ${item.name}: ${item.stockQuantity} pcs, ${item.price}`
        );
        liveInventoryContext = `LIVE SHOP INVENTORY FROM DATABASE: ${inventory.length} items\n${inventoryLines.join("\n")}\nAlways refer strictly to this real-time stock and pricing when staff inquire about product availability.`;
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
          answer = await getFallbackResponse(
            conversation[conversation.length - 1].content,
            getGeminiErrorMessage(lastGeminiError)
          );
        }
      } catch (error) {
        console.error("Gemini API Error:", error);
        answer = await getFallbackResponse(
          conversation[conversation.length - 1].content,
          getGeminiErrorMessage(error)
        );
      }
    } else {
      answer = await getFallbackResponse(
        conversation[conversation.length - 1].content,
        "Missing GEMINI_API_KEY"
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Help API Error:", error);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
