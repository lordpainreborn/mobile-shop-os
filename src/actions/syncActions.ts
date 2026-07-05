"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSaleSchema } from "@/lib/validations";

export async function syncOfflineSale(data: {
  items: { productId: string; quantity: number; unitPrice: number }[];
  paymentMethod: string;
}) {
  try {
    const user = await requireAuth();
    const parsed = createSaleSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid sale data" };
    }

    const { items, paymentMethod } = parsed.data;
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discount = subtotal * 0.02;
    const taxable = subtotal - discount;
    const tax = taxable * 0.05;
    const totalAmount = taxable + tax;
    const costTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice * 0.7, 0);
    const profit = totalAmount - costTotal;

    const sale = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) }, shopId: user.shopId },
      });
      const stockMap = new Map(products.map((p) => [p.id, p.stockQuantity]));

      for (const item of items) {
        const stock = stockMap.get(item.productId);
        if (stock === undefined || stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.productId}`);
        }
      }

      const created = await tx.sale.create({
        data: {
          totalAmount,
          paymentMethod,
          profit,
          shopId: user.shopId,
          items: { create: items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })) },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.updateMany({
          where: { id: item.productId, shopId: user.shopId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      return created;
    });

    revalidatePath("/sales");
    revalidatePath("/products");
    return { success: true, data: sale };
  } catch (error) {
    console.error("[syncOfflineSale]", error);
    return { success: false, error: error instanceof Error ? error.message : "Sync failed" };
  }
}
