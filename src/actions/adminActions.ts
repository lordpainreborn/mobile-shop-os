"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export type AdminActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type CreateShopInput = {
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
};

export async function createShop(
  data: CreateShopInput
): Promise<AdminActionResponse<{ shopId: string; userId: string }>> {
  try {
    const user = await requireAuth();
    if (user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Only Super Admin can create shops" };
    }

    if (!data.shopName.trim()) return { success: false, error: "Shop name is required" };
    if (!data.ownerName.trim()) return { success: false, error: "Owner name is required" };
    if (!data.ownerEmail.trim()) return { success: false, error: "Owner email is required" };
    if (data.ownerPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.ownerEmail.trim().toLowerCase() },
    });
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(data.ownerPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const shop = await tx.shop.create({
        data: {
          name: data.shopName.trim(),
          ownerName: data.ownerName.trim(),
          phone: "",
        },
      });

      const shopUser = await tx.user.create({
        data: {
          email: data.ownerEmail.trim().toLowerCase(),
          passwordHash,
          name: data.ownerName.trim(),
          role: "SHOP_OWNER",
          shopId: shop.id,
        },
      });

      return { shopId: shop.id, userId: shopUser.id };
    });

    revalidatePath("/admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("[createShop]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create shop",
    };
  }
}

export async function getAdminStats(): Promise<
  AdminActionResponse<{
    totalShops: number;
    totalUsers: number;
    totalProducts: number;
    shops: {
      id: string;
      name: string;
      ownerName: string;
      phone: string;
      createdAt: Date;
      _count: { users: number; products: number };
    }[];
  }>
> {
  try {
    const user = await requireAuth();
    if (user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Only Super Admin can access admin stats" };
    }

    const [totalShops, totalUsers, totalProducts, shops] = await Promise.all([
      prisma.shop.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.shop.findMany({
        include: {
          _count: { select: { users: true, products: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      success: true,
      data: { totalShops, totalUsers, totalProducts, shops },
    };
  } catch (error) {
    console.error("[getAdminStats]", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Authentication required" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch admin stats",
    };
  }
}
