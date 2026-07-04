"use server";

import { revalidatePath } from "next/cache";
import { Prisma, ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

type ProductWithImeis = Prisma.ProductGetPayload<{ include: { imeis: true } }>;

export type CreateProductInput = {
  name: string;
  sku?: string;
  category: "PHONE" | "ACCESSORY" | "PART";
  price: number;
  cost: number;
  stockQuantity: number;
};

const VALID_CATEGORIES: ProductCategory[] = ["PHONE", "ACCESSORY", "PART"];

const isValidCategory = (value: string): value is ProductCategory =>
  VALID_CATEGORIES.includes(value as ProductCategory);

export async function getProducts(
  search?: string,
  category?: string
): Promise<ActionResponse<ProductWithImeis[]>> {
  try {
    const user = await requireAuth();

    const where: Prisma.ProductWhereInput = { shopId: user.shopId };

    if (category && isValidCategory(category)) {
      where.category = category;
    }

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      where.OR = [
        { name: { contains: trimmedSearch, mode: "insensitive" } },
        { sku: { contains: trimmedSearch, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { imeis: true },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("[getProducts]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

export async function createProduct(
  data: CreateProductInput
): Promise<ActionResponse<ProductWithImeis>> {
  try {
    const user = await requireAuth();

    if (!data.name.trim()) {
      return { success: false, error: "Product name is required" };
    }
    if (data.price < 0 || data.cost < 0 || data.stockQuantity < 0) {
      return { success: false, error: "Price, cost, and stock must be non-negative" };
    }
    if (!isValidCategory(data.category)) {
      return { success: false, error: "Invalid product category" };
    }

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        sku: data.sku?.trim() || null,
        category: data.category,
        price: data.price,
        cost: data.cost,
        stockQuantity: data.stockQuantity,
        shopId: user.shopId,
      },
      include: { imeis: true },
    });

    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("[createProduct]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "A product with this SKU already exists in your shop" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(
  id: string,
  data: CreateProductInput
): Promise<ActionResponse<ProductWithImeis>> {
  try {
    const user = await requireAuth();

    if (!id.trim()) return { success: false, error: "Product ID is required" };
    if (!data.name.trim()) return { success: false, error: "Product name is required" };
    if (data.price < 0 || data.cost < 0 || data.stockQuantity < 0) {
      return { success: false, error: "Price, cost, and stock must be non-negative" };
    }
    if (!isValidCategory(data.category)) {
      return { success: false, error: "Invalid product category" };
    }

    const existing = await prisma.product.findFirst({
      where: { id, shopId: user.shopId },
    });
    if (!existing) {
      return { success: false, error: "Product not found in your shop" };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name.trim(),
        sku: data.sku?.trim() || null,
        category: data.category,
        price: data.price,
        cost: data.cost,
        stockQuantity: data.stockQuantity,
      },
      include: { imeis: true },
    });

    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("[updateProduct]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "A product with this SKU already exists" };
      }
      if (error.code === "P2025") {
        return { success: false, error: "Product not found" };
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(
  id: string
): Promise<ActionResponse<{ id: string }>> {
  try {
    const user = await requireAuth();

    if (!id.trim()) return { success: false, error: "Product ID is required" };

    const existing = await prisma.product.findFirst({
      where: { id, shopId: user.shopId },
    });
    if (!existing) {
      return { success: false, error: "Product not found in your shop" };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/products");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("[deleteProduct]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { success: false, error: "Product not found" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
