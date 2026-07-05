import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const url = new URL(request.url);
    const imei = url.searchParams.get("imei");

    if (!imei) {
      return NextResponse.json(
        { success: false, error: "IMEI parameter is required" },
        { status: 400 }
      );
    }

    const imeiRecord = await prisma.iMEI.findUnique({
      where: { imeiCode: imei },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            warrantyMonths: true,
            price: true,
          },
        },
      },
    });

    if (!imeiRecord) {
      return NextResponse.json(
        { success: false, error: "IMEI not found" },
        { status: 404 }
      );
    }

    const product = imeiRecord.product;
    const warrantyDays = product.warrantyMonths * 30;
    const saleRecord = await prisma.saleItem.findFirst({
      where: {
        productId: product.id,
        sale: { shopId: user.shopId },
      },
      include: { sale: { select: { createdAt: true } } },
      orderBy: { sale: { createdAt: "desc" } },
    });

    let warrantyRemaining = warrantyDays;
    let warrantyEndDate: Date | null = null;
    let isUnderWarranty = false;

    if (saleRecord) {
      warrantyEndDate = new Date(saleRecord.sale.createdAt);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + product.warrantyMonths);
      const now = new Date();
      warrantyRemaining = Math.max(0, Math.ceil((warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      isUnderWarranty = warrantyRemaining > 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        imei: imeiRecord.imeiCode,
        status: imeiRecord.status,
        product: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        warrantyMonths: product.warrantyMonths,
        warrantyRemaining,
        warrantyEndDate,
        isUnderWarranty,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to lookup IMEI" }, { status: 500 });
  }
}
