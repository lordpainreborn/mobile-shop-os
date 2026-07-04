import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authUser = await getSessionUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const name = body?.name !== undefined ? String(body.name).trim() : undefined;
    const shopName = body?.shopName !== undefined ? String(body.shopName).trim() : undefined;
    const avatarUrl = body?.avatarUrl !== undefined ? String(body.avatarUrl).trim() : undefined;

    const updateData: Record<string, string> = {};
    if (name !== undefined) updateData.name = name;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (shopName !== undefined) {
      try {
        await prisma.shop.update({
          where: { id: authUser.shopId },
          data: { name: shopName },
        });
      } catch { /* shop name update is best-effort */ }
    }

    if (Object.keys(updateData).length > 0) {
      try {
        await prisma.user.update({
          where: { id: authUser.id },
          data: updateData,
        });
      } catch {
        if (updateData.name) {
          await prisma.user.update({
            where: { id: authUser.id },
            data: { name: updateData.name },
          });
        }
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        shopId: true,
        avatarUrl: true,
        shop: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser
        ? {
            ...updatedUser,
            shopName: updatedUser.shop?.name ?? "",
          }
        : null,
    });
  } catch (error) {
    console.error("[update-profile]", error);
    return NextResponse.json(
      { success: false, message: "Profile update failed." },
      { status: 500 }
    );
  }
}
