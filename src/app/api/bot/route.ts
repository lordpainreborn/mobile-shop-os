import { NextResponse } from "next/server";
import { bot } from "@/lib/telegramBot";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const update = await request.json();
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[bot-webhook] Error handling update:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "AIOMS Telegram Bot webhook endpoint",
    docs: "Set this URL as Telegram webhook: POST /api/bot",
  });
}
