import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the friendly, intelligent AI Support Assistant embedded inside 'Mobile Shop OS'. Speak fluently in both Burmese and English based on the user's language. Guide staff on how to use our system:
- Products Page: Add, edit, delete items, and check inventory.
- Repairs Page: Create repair tickets, track device repair status, update costs.
- POS Page: Add products to cart, checkout, and generate sales invoices.
If users ask general conversation or technical troubleshooting questions, answer them smartly and naturally like real Gemini/ChatGPT.
If this is a continuation or follow-up question, jump straight into the helpful answer immediately without re-introducing yourself. Do not repeat the greeting or say "Hello, I am Mobile Shop OS Assistant" again.`;

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
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const prompt = String(body.prompt || "").trim();

    const fullMessages = messages.length > 0 ? messages : prompt ? [{ role: "user", content: prompt }] : [];
    const lastMessage = fullMessages[fullMessages.length - 1];
    const currentUserMessage = lastMessage?.role === "user" ? String(lastMessage.content || "").trim() : prompt;
    const historyMessages = lastMessage?.role === "user" ? fullMessages.slice(0, -1) : fullMessages;

    if (!currentUserMessage) {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    let answer = "";

    if (geminiKey) {
      try {
        const client = new GoogleGenAI({ apiKey: geminiKey });
        const chat = client.chats.create({
          model: "gemini-2.5-flash",
          config: {
            temperature: 0.8,
            maxOutputTokens: 2048,
          },
          history: [
            {
              role: "system",
              parts: [{ text: SYSTEM_PROMPT }],
            },
            ...historyMessages.map((message: any) => ({
              role: message.role === "assistant" ? "model" : message.role === "user" ? "user" : String(message.role),
              parts: [{ text: String(message.content ?? message.text ?? "") }],
            })),
          ],
        });

        const response = await chat.sendMessage({ message: currentUserMessage });
        answer = response.text?.trim() || "";
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
        answer = await getFallbackResponse(currentUserMessage);
      }
    } else {
      answer = await getFallbackResponse(currentUserMessage);
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
