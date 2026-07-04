import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const identifier = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: "Email/Username and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: { contains: identifier, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        shopId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email/username or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid email/username or password" }, { status: 401 });
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
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}
