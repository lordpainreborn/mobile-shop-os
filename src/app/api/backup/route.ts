import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST() {
  try {
    const user = await requireAuth();

    if (user.role !== "SHOP_OWNER" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Only shop owners can create backups" },
        { status: 403 }
      );
    }

    const shopData = await prisma.shop.findUnique({
      where: { id: user.shopId },
      include: {
        users: true,
        products: {
          include: { imeis: true },
        },
        sales: {
          include: { items: true },
        },
        tickets: {
          include: { usedParts: true },
        },
        tradeInItems: true,
        expenses: true,
      },
    });

    const backup = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      shopId: user.shopId,
      data: shopData,
    };

    const jsonString = JSON.stringify(backup, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="aioms_backup_${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Backup failed" }, { status: 500 });
  }
}
