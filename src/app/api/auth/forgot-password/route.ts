import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
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
  const rateKey = `forgot:${ip}`;
  const rateLimit = checkRateLimit(rateKey, 3, 300000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many attempts. Retry after ${rateLimit.retryAfter}s` },
      { status: 429, headers: getRateLimitHeaders(rateKey, 3) }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const action = body.action as string;

    if (action === "send") {
      const parsed = forgotPasswordSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
          { status: 400 }
        );
      }

      const { email } = parsed.data;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json({
          success: true,
          message: "If the email exists, a verification code has been sent",
        });
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.verificationCode.create({
        data: { email, code, type: "RESET_PASSWORD", expiresAt },
      });

      await sendVerificationEmail(email, code, "RESET");

      return NextResponse.json({
        success: true,
        message: "If the email exists, a verification code has been sent",
      });
    }

    if (action === "reset") {
      const parsed = resetPasswordSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
          { status: 400 }
        );
      }

      const { email, code, newPassword } = parsed.data;

      const verification = await prisma.verificationCode.findFirst({
        where: {
          email,
          code,
          type: "RESET_PASSWORD",
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

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { email },
        data: { passwordHash },
      });

      await prisma.verificationCode.deleteMany({
        where: { email, type: "RESET_PASSWORD" },
      });

      return NextResponse.json({
        success: true,
        message: "Password reset successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[forgot-password]", error);
    return NextResponse.json(
      { success: false, error: "Operation failed" },
      { status: 500 }
    );
  }
}
