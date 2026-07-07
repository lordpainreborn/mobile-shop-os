import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegramBot";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[bot-webhook] Error handling update:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const setup = searchParams.get("setup");

  if (setup === "webhook") {
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const webhookUrl = `${baseUrl}/api/bot`;
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN ?? "8880051823:AAHOHIHxNwo0LU31UqTlIYM8s44QYNZ1AWk"}/setWebhook?url=${webhookUrl}`,
      );
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
  }

  const infoRes = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN ?? "8880051823:AAHOHIHxNwo0LU31UqTlIYM8s44QYNZ1AWk"}/getWebhookInfo`,
  );
  const info = await infoRes.json();

  return NextResponse.json({
    status: "active",
    message: "AIOMS Telegram Bot webhook endpoint",
    docs: "POST /api/bot — Telegram update handler | GET /api/bot?setup=webhook — auto-register webhook",
    webhookInfo: info.result ?? info,
  });
}
