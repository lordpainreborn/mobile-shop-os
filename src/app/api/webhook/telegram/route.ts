import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { telegramWebhookSchema } from "@/lib/validations";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const parsed = telegramWebhookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: true });
    }

    const { message } = parsed.data;

    if (!message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();

    if (text.startsWith("/renew")) {
      const parts = text.split(/\s+/);
      if (parts.length < 3) {
        return NextResponse.json({ ok: true });
      }

      const shopId = parts[1];
      const days = parseInt(parts[2], 10);

      if (isNaN(days) || days <= 0 || days > 365) {
        return NextResponse.json({ ok: true });
      }

      const shop = await prisma.shop.findUnique({ where: { id: shopId } });
      if (!shop) {
        return NextResponse.json({ ok: true });
      }

      const currentExpiry = shop.licenseExpiry ?? new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + days);

      await prisma.shop.update({
        where: { id: shopId },
        data: { licenseExpiry: newExpiry },
      });

      return NextResponse.json({
        ok: true,
        message: `License for shop ${shopId} extended by ${days} days. New expiry: ${newExpiry.toISOString()}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram-webhook]", error);
    return NextResponse.json({ ok: true });
  }
}
