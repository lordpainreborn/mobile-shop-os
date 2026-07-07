import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const shop = await prisma.shop.create({
        data: { name: name + "'s Shop", ownerName: name, phone: "" },
      });
      user = await prisma.user.create({
        data: { email, name, passwordHash: "", role: "SHOP_OWNER", shopId: shop.id },
      });
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "SUPER_ADMIN" | "SHOP_OWNER" | "STAFF",
      shopId: user.shopId,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[auth/sync]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
