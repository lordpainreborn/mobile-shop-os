import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const oldPassword = String(body?.oldPassword ?? "");
    const newPassword = String(body?.newPassword ?? "");

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "လက်ရှိ စကားဝှက်နှင့် အသစ် စကားဝှက် နှစ်ခုလုံး ထည့်ပါ။" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "စကားဝှက်အသစ်သည် အနည်းဆုံး စာလုံး ၆ လုံး ရှိရပါမည်။" },
        { status: 400 }
      );
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, passwordHash: true },
    });

    if (!fullUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(oldPassword, fullUser.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "လက်ရှိ စကားဝှက်ဟောင်း မမှန်ကန်ပါ။ ပြန်လည်စစ်ဆေးပါ။" },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "စကားဝှက် ပြောင်းလဲခြင်း အောင်မြင်ပါသည်။",
    });
  } catch (error) {
    console.error("[change-password]", error);
    return NextResponse.json(
      { success: false, message: "စကားဝှက်ပြောင်းလဲခြင်း မအောင်မြင်ပါ။" },
      { status: 500 }
    );
  }
}
