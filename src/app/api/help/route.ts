import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the bilingual (English/Burmese) AI Support Assistant for Mobile Shop OS. Answer questions clearly about Products, Repairs, POS, and Login/Accounts.

CRITICAL CONVERSATION RULES:
- Never re-introduce yourself ('Hello, I am AI...') if the conversation is ongoing. Jump directly into answering the user's prompt.
- Never truncate your explanation; keep it complete and helpful.

CRITICAL ESCALATION RULE:
- ONLY IF you do not know the answer, if the query is out of scope, or if the user explicitly needs human help, reply politely explaining that you don't have this info.
- Then include the exact tag [ESCALATE_ADMIN] in your response along with these contact details:
  - Telegram: @LordPainReborn (https://t.me/LordPainReborn)
  - Phone: +959961089869
  - Viber: +959798293948
  - Facebook: Bhone Myat Paing

Speak naturally in English or Burmese depending on the user's language. Answer as a helpful Mobile Shop OS support assistant.`;

const fallbackResponses: Record<string, string> = {
  addProduct: `📦 Products Page Tutorial:
1. Go to Products.
2. Click \"Add Product\".
3. Fill in name, category, cost, price, and stock.
4. Save to add it to inventory.
5. Use edit icons to update details or delete to remove items.

မြန်မာဘာသာ: မည်သည့်ထုတ်ကုန်ကိုမဆို \"Products\" စာမျက်နှာတွင် \"Add Product\" ကိုနှိပ်ပြီး အမည်၊ အမျိုးအစား၊ ဝယ်ဈေး၊ ရောင်းဈေးနှင့် စတော့အရေအတွက်ကိုထည့်ပါ။ ပြီးချိန်တွင် သိမ်းဆည်းလိုက်ပါ။`,
  repairTicket: `🛠️ Repairs Page Guide:
1. Open Repairs.
2. Click \"New Ticket\" or \"Open Repair\".
3. Enter device model, issue, customer name, and estimate cost.
4. Save the ticket and use the status selector to update progress.

မြန်မာဘာသာ: \"Repairs\" စာမျက်နှာတွင် \"New Ticket\" ကိုနှိပ်ပြီး ကိရိယာအမျိုးအစား၊ ပြဿနာ၊ ဖောက်သည်အမည်နှင့် ခန့်မှန်းစရိတ်ကိုထည့်ပါ။ သိမ်းပြီးနောက် အခြေအနေကို အဆင့်မြှင့်နိုင်သည်။`,
  posGuide: `🛒 POS / Sales Guide:
1. Open Sales.
2. Add products into the cart.
3. Adjust quantity and verify totals.
4. Complete checkout and record the transaction.

မြန်မာဘာသာ: \"Sales\" စာမျက်နှာတွင် ကုန်ပစ္စည်းများကို ကတ်ထဲထည့်ပါ၊ အရေအတွက်ကိုပြင်ဆင်ပါ၊ ငွေပေးချေမှုကိုပြီးမြောက်ပါက သွင်းသတ်သက်ပါ။`,
};

const queryMap: { keywords: string[]; key: keyof typeof fallbackResponses }[] = [
  { keywords: ["product", "inventory", "stock", "add product", "edit product", "delete product"], key: "addProduct" },
  { keywords: ["repair", "ticket", "estimate", "status", "device issue", "service"], key: "repairTicket" },
  { keywords: ["pos", "sales", "checkout", "cart", "transaction"], key: "posGuide" },
];

async function getFallbackResponse(message: string) {
  const normalized = message.trim().toLowerCase();
  for (const { keywords, key } of queryMap) {
    if (keywords.some((word) => normalized.includes(word))) {
      return fallbackResponses[key];
    }
  }
  return `Hello! I am your Mobile Shop OS assistant. I can help with:
- Products page guidance
- Repairs page tickets and status updates
- POS sales checkout workflows

Ask me something like \"How do I add a product?\" or \"How do I open a repair ticket?\``;
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

    const formattedHistory = [
      {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      ...conversation.map((message) => ({
        role: message.role === "assistant" ? "model" : message.role,
        parts: [{ text: message.content }],
      })),
    ];

    const geminiKey = process.env.GEMINI_API_KEY;
    let answer = "";

    if (geminiKey) {
      try {
        const client = new GoogleGenAI({ apiKey: geminiKey });
        const response = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: formattedHistory,
          config: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          },
        });

        answer = response.text?.trim() ?? "";
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
        answer = await getFallbackResponse(conversation[conversation.length - 1].content);
      }
    } else {
      answer = await getFallbackResponse(conversation[conversation.length - 1].content);
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
