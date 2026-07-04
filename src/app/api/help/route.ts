import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return NextResponse.json({
    status: "ok",
    message: "Mobile Shop OS Support API",
    shopId: user.shopId,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const action = String(body?.action ?? "");

    if (action === "inventory") {
      const products = await prisma.product.findMany({
        where: { shopId: user.shopId },
        select: {
          name: true,
          category: true,
          price: true,
          stockQuantity: true,
        },
        take: 30,
      });

      return NextResponse.json({ products, shopId: user.shopId });
    }

    return NextResponse.json({ message: "Tutorial center. Use the widget for guides." });
  } catch (error) {
    console.error("[help POST]", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
