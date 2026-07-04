import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, message: "Logged out" });
}
