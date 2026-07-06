import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    const rateKey = `send-otp:${ip}`;
    const rateLimit = checkRateLimit(rateKey, 3, 300000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Retry after ${rateLimit.retryAfter}s` },
        { status: 429, headers: getRateLimitHeaders(rateKey, 3) }
      );
    }

    const raw = await request.json().catch(() => ({}));
    const body = raw as Record<string, unknown>;
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    await prisma.verificationCode.deleteMany({
      where: { email, type: "SIGNUP" },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationCode.create({
      data: { email, code, type: "SIGNUP", expiresAt },
    });

    console.log("SENDING OTP CODE:", code);

    await sendVerificationEmail(email, code, "SIGNUP");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DEBUG-SMTP-ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown SMTP Error" },
      { status: 500 }
    );
  }
}
