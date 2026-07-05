import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, verifyEmailSchema } from "@/lib/validations";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";
import { sendVerificationEmail } from "@/lib/email";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rateKey = `register:${ip}`;
  const rateLimit = checkRateLimit(rateKey, 3, 300000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many attempts. Retry after ${rateLimit.retryAfter}s` },
      { status: 429, headers: getRateLimitHeaders(rateKey, 3) }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { shopName, ownerName, email, password, phone } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const shop = await prisma.shop.create({
      data: {
        name: shopName,
        ownerName,
        phone,
        users: {
          create: {
            email,
            passwordHash,
            name: ownerName,
            role: "SHOP_OWNER",
            emailVerified: false,
          },
        },
      },
      include: { users: { select: { id: true } } },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: { email, code, type: "REGISTER", expiresAt },
    });

    await sendVerificationEmail(email, code, "SIGNUP");

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      email,
    });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
