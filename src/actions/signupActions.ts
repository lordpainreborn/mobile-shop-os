"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendSignupOTP(data: {
  shopName: string;
  ownerName: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; fallbackCode?: string; devMode?: boolean; error?: string; code?: string }> {
  const { shopName, ownerName, email, password } = data;

  if (!shopName.trim() || !ownerName.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: "All fields are required" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    await prisma.verificationCode.deleteMany({
      where: { email: normalizedEmail, type: "SIGNUP" },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        email: normalizedEmail,
        code,
        type: "SIGNUP",
        expiresAt,
      },
    });

    const result = await sendVerificationEmail(normalizedEmail, code, "SIGNUP");

    return {
      success: true,
      fallbackCode: result.fallbackCode,
      devMode: result.devMode,
    };
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error("AUTH API CRASH DETECTED [sendSignupOTP]:", {
      message: err?.message,
      stack: err?.stack,
      code: err?.code,
    });
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P1001") {
        return { success: false, error: "Database connection failed. Check DATABASE_URL." };
      }
      return { success: false, error: `Database error: ${err.message}`, code: err.code };
    }
    return { success: false, error: err?.message || "Server error. Please try again." };
  }
}

export async function verifySignupOTP(data: {
  shopName: string;
  ownerName: string;
  email: string;
  password: string;
  code: string;
}): Promise<{ success: boolean; error?: string; code?: string }> {
  const { shopName, ownerName, email, password, code } = data;

  if (!code.trim()) {
    return { success: false, error: "Verification code is required" };
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email: normalizedEmail,
        code: code.trim(),
        type: "SIGNUP",
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationCode) {
      return {
        success: false,
        error: "ထည့်သွင်းထားသော ကုဒ်မှားယွင်းနေပါသည်။ ပြန်လည်စစ်ဆေးပါ။ (Invalid or expired code)",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const shop = await prisma.shop.create({
      data: {
        name: shopName.trim(),
        ownerName: ownerName.trim(),
        phone: "",
      },
    });

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: ownerName.trim(),
        role: "SHOP_OWNER",
        shopId: shop.id,
      },
    });

    await prisma.verificationCode.deleteMany({
      where: { email: normalizedEmail, type: "SIGNUP" },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      shopId: shop.id,
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error("AUTH API CRASH DETECTED [verifySignupOTP]:", {
      message: err?.message,
      stack: err?.stack,
      code: err?.code,
    });
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication failed. Please try signing up again." };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, error: `Database error: ${err.message}`, code: err.code };
    }
    return { success: false, error: err?.message || "Server error. Please try again." };
  }
}
