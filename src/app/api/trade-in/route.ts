import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createTradeInSchema } from "@/lib/validations";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function GET() {
  try {
    const user = await requireAuth();
    const items = await prisma.tradeInItem.findMany({
      where: { shopId: user.shopId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch trade-in items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const parsed = createTradeInSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const item = await prisma.tradeInItem.create({
      data: {
        ...parsed.data,
        shopId: user.shopId,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to create trade-in item" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const { id, ...updateData } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 });
    }

    const item = await prisma.tradeInItem.updateMany({
      where: { id, shopId: user.shopId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to update trade-in item" }, { status: 500 });
  }
}
