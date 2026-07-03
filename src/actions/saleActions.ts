"use server";

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

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
};

type SaleWithItems = Prisma.SaleGetPayload<{ include: { items: true } }>;

export async function createSale(
  data: CreateSaleInput
): Promise<ActionResponse<SaleWithItems>> {
  try {
    if (!data.paymentMethod.trim()) {
      return { success: false, error: 'Payment method is required' };
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return { success: false, error: 'Sale items are required' };
    }

    const normalizedItems = data.items.reduce<Record<string, SaleItemInput>>((acc, item) => {
      const productId = item.productId.trim();
      if (!productId) {
        throw new Error('Product ID is required for each item');
      }
      if (item.quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }
      if (item.unitPrice < 0) {
        throw new Error('Unit price must be non-negative');
      }
      const existing = acc[productId];
      if (!existing) {
        acc[productId] = { productId, quantity: item.quantity, unitPrice: item.unitPrice };
        return acc;
      }
      if (existing.unitPrice !== item.unitPrice) {
        throw new Error('Consistent unit price required per product');
      }
      existing.quantity += item.quantity;
      return acc;
    }, {});

    const items = Object.values(normalizedItems);
    if (items.length === 0) {
      return { success: false, error: 'Sale items are required' };
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const sale = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
      });

      const productsById = products.reduce<Record<string, number>>((acc, product) => {
        acc[product.id] = product.stockQuantity;
        return acc;
      }, {});

      for (const item of items) {
        const stock = productsById[item.productId];
        if (stock === undefined) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.productId}`);
        }
      }

      const createdSale = await tx.sale.create({
        data: {
          totalAmount,
          paymentMethod: data.paymentMethod.trim(),
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

    revalidatePath('/sales');
    revalidatePath('/products');

    return { success: true, data: sale };
  } catch (error) {
    console.error('[createSale]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create sale',
    };
  }
}
