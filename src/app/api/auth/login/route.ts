import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, error: "Critical: DATABASE_URL is missing in environment variables." },
        { status: 500 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateKey = `login:${ip}`;
    const rateLimit = checkRateLimit(rateKey, 5, 60000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Retry after ${rateLimit.retryAfter}s` },
        { status: 429, headers: getRateLimitHeaders(rateKey, 5) }
      );
    }

    const raw = await request.json().catch(() => ({}));
    const body = raw as Record<string, unknown>;

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        shopId: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မမှန်ကန်ပါ။" },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      console.error("AUTH API CRASH DETECTED [login]: user record missing passwordHash for", email);
      return NextResponse.json(
        { success: false, error: "Account configuration error. Contact support." },
        { status: 500 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မမှန်ကန်ပါ။" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Please verify your email first, or ask the admin to activate your account.", needsVerification: true },
        { status: 403 }
      );
    }

    const token = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "SUPER_ADMIN" | "SHOP_OWNER" | "STAFF",
      shopId: user.shopId,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
      },
    });
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error("AUTH API CRASH DETECTED [login]:", {
      message: err?.message,
      stack: err?.stack,
      code: err?.code,
    });
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: err.message, code: err.code },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: err?.message || "Login failed due to an unexpected error", code: err?.code },
      { status: 500 }
    );
  }
}
