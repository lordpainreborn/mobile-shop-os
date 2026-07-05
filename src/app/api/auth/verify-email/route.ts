import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmailSchema } from "@/lib/validations";
import { createSession } from "@/lib/auth";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateKey = `verify:${ip}`;
  const rateLimit = checkRateLimit(rateKey, 5, 300000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many attempts. Retry after ${rateLimit.retryAfter}s` },
      { status: 429, headers: getRateLimitHeaders(rateKey, 5) }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;

    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: "REGISTER",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
      select: { id: true, email: true, name: true, role: true, shopId: true },
    });

    await prisma.verificationCode.deleteMany({
      where: { email, type: "REGISTER" },
    });

    const token = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "SUPER_ADMIN" | "SHOP_OWNER" | "STAFF",
      shopId: user.shopId,
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
      },
    });
  } catch (error) {
    console.error("[verify-email]", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
