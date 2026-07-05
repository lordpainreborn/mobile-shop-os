"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSaleSchema } from "@/lib/validations";

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type SaleItemInput = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type CreateSaleInput = {
  items: SaleItemInput[];
  paymentMethod: string;
  cashAmount?: number;
  kbzPayAmount?: number;
  cbPayAmount?: number;
  wavePayAmount?: number;
};

type SaleWithItems = Prisma.SaleGetPayload<{ include: { items: true } }>;

const DISCOUNT_RATE = 0.02;
const TAX_RATE = 0.05;

export async function createSale(
  data: CreateSaleInput
): Promise<ActionResponse<SaleWithItems>> {
  try {
    const user = await requireAuth();

    const parsed = createSaleSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { items: rawItems, paymentMethod, cashAmount, kbzPayAmount, cbPayAmount, wavePayAmount } = parsed.data;

    const normalizedItems = rawItems.reduce<Record<string, SaleItemInput>>((acc, item) => {
      const productId = item.productId.trim();
      if (!productId) throw new Error("Product ID is required for each item");
      const existing = acc[productId];
      if (!existing) {
        acc[productId] = { productId, quantity: item.quantity, unitPrice: item.unitPrice };
        return acc;
      }
      if (existing.unitPrice !== item.unitPrice) {
        throw new Error("Consistent unit price required per product");
      }
      existing.quantity += item.quantity;
      return acc;
    }, {});

    const items = Object.values(normalizedItems);
    if (items.length === 0) {
      return { success: false, error: "Sale items are required" };
    }

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discount = subtotal * DISCOUNT_RATE;
    const taxable = subtotal - discount;
    const tax = taxable * TAX_RATE;
    const totalAmount = taxable + tax;

    const costTotal = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice * 0.7;
    }, 0);
    const profit = totalAmount - costTotal;

    const sale = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
          shopId: user.shopId,
        },
      });

      const productsById = products.reduce<Record<string, number>>((acc, product) => {
        acc[product.id] = product.stockQuantity;
        return acc;
      }, {});

      for (const item of items) {
        const stock = productsById[item.productId];
        if (stock === undefined) {
          throw new Error(`Product not found in your shop: ${item.productId}`);
        }
        if (stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.productId}`);
        }
      }

      const createdSale = await tx.sale.create({
        data: {
          totalAmount,
          paymentMethod,
          cashAmount: cashAmount ?? (paymentMethod === "CASH" ? totalAmount : null),
          kbzPayAmount: kbzPayAmount ?? (paymentMethod === "KBZPAY" ? totalAmount : null),
          cbPayAmount: cbPayAmount ?? (paymentMethod === "CBPAY" ? totalAmount : null),
          wavePayAmount: wavePayAmount ?? (paymentMethod === "WAVE" ? totalAmount : null),
          profit,
          shopId: user.shopId,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        const updatedCount = await tx.product.updateMany({
          where: {
            id: item.productId,
            shopId: user.shopId,
            stockQuantity: { gte: item.quantity },
          },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (updatedCount.count !== 1) {
          throw new Error(`Insufficient stock for product: ${item.productId}`);
        }
      }

      return createdSale;
    });

    revalidatePath("/sales");
    revalidatePath("/products");
    revalidatePath("/reports");
    return { success: true, data: sale };
  } catch (error) {
    console.error("[createSale]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create sale",
    };
  }
}
