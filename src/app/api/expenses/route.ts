import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createExpenseSchema } from "@/lib/validations";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function GET() {
  try {
    const user = await requireAuth();
    const expenses = await prisma.expense.findMany({
      where: { shopId: user.shopId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const parsed = createExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        ...parsed.data,
        shopId: user.shopId,
      },
    });

    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to create expense" }, { status: 500 });
  }
}
