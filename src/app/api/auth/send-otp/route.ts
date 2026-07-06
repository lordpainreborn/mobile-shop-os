import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BrevoClient } from '@getbrevo/brevo';
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function htmlTemplate(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:700;">AIOMS POS</h1>
      <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">All In One Mobile Shop</p>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="color:#0f172a;font-size:18px;margin:0 0 12px;text-align:center;">AIOMS POS Verification Code</h2>
      <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;text-align:center;">Use the code below to verify your email and create your account.</p>
      <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
        <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your Verification Code</p>
        <p style="color:#0f172a;font-size:32px;font-weight:800;letter-spacing:6px;margin:0;">${code}</p>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">This code expires in 10 minutes. Do not share this code with anyone.</p>
    </div>
    <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} AIOMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
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

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.log("BREVO NOT CONFIGURED — returning code as fallback");
      return NextResponse.json({
        success: true,
        message: "OTP generated (email skipped — BREVO_API_KEY not set).",
        fallbackCode: code,
        devMode: true,
      });
    }

    const client = new BrevoClient({ apiKey });

    const response = await client.transactionalEmails.sendTransacEmail({
      sender: { name: "AIOMS POS", email: "aioms.app@gmail.com" },
      to: [{ email }],
      subject: "Your AIOMS POS Verification Code",
      htmlContent: htmlTemplate(code),
    });

    console.log("BREVO EMAIL SENT SUCCESSFULLY:", response);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error("AUTH API CRASH DETECTED [send-otp]:", {
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
      { success: false, error: err?.message || "Internal Database/Auth Error", code: err?.code },
      { status: 500 }
    );
  }
}
