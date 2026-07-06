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
    const shopName = body?.shopName !== undefined && body?.shopName !== null ? String(body.shopName).trim() : undefined;
    const rawAvatar = body?.avatarUrl;
    const avatarUrl = rawAvatar !== undefined && rawAvatar !== null ? String(rawAvatar).trim() : rawAvatar;

    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (shopName !== undefined) {
      try {
        await prisma.shop.update({
          where: { id: authUser.shopId },
          data: { name: shopName },
        });
      } catch (e) {
        console.error("[update-profile] shop name update failed:", e);
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: authUser.id },
        data: updateData,
      });
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
