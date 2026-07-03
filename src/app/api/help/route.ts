import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the helpful AI Support & Tutorial Assistant for 'Mobile Shop OS'. Guide shop staff clearly in English or Burmese. Explain step-by-step how to use the system:
- Products Page: How to add, edit, or delete items and check stock inventory.
- Repairs Page: How to open a repair ticket, track estimate costs, and update device status.
- POS / Sales: How to add products to cart, checkout, and manage transactions.
Keep responses friendly, structured, and concise.`;

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
    const prompt = String(body.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
    }

    const openAIKey = process.env.OPENAI_API_KEY;
    let answer = "";

    if (openAIKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 400,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI status ${response.status}`);
        }

        const result = await response.json();
        answer = result?.choices?.[0]?.message?.content?.trim();
      } catch (openAIError) {
        answer = await getFallbackResponse(prompt);
      }
    } else {
      answer = await getFallbackResponse(prompt);
    }

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
