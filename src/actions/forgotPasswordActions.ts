"use server";

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendResetOTP(data: {
  email: string;
}): Promise<{ success: boolean; fallbackCode?: string; error?: string }> {
  const { email } = data;

  if (!email.trim()) {
    return { success: false, error: "Email is required" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return { success: true };
    }

    await prisma.verificationCode.deleteMany({
      where: { email: normalizedEmail, type: "RESET" },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        email: normalizedEmail,
        code,
        type: "RESET",
        expiresAt,
      },
    });

    const result = await sendVerificationEmail(normalizedEmail, code, "RESET");

    return {
      success: true,
      fallbackCode: result.fallbackCode,
    };
  } catch (error) {
    console.error("[sendResetOTP] Server error:", error);
    return { success: false, error: "Server error. Please try again." };
  }
}

export async function verifyResetOTP(data: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, code, newPassword } = data;

  if (!code.trim()) {
    return { success: false, error: "Verification code is required" };
  }

  if (!newPassword.trim()) {
    return { success: false, error: "New password is required" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email: normalizedEmail,
        code: code.trim(),
        type: "RESET",
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationCode) {
      return {
        success: false,
        error: "ထည့်သွင်းထားသော ကုဒ်မှားယွင်းနေပါသည်။ ပြန်လည်စစ်ဆေးပါ။ (Invalid or expired code)",
      };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash },
    });

    await prisma.verificationCode.deleteMany({
      where: { email: normalizedEmail, type: "RESET" },
    });

    return { success: true };
  } catch (error) {
    console.error("[verifyResetOTP] Server error:", error);
    return { success: false, error: "Server error. Please try again." };
  }
}
