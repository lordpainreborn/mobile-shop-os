import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Tutorial center is now offline. Please use the in-widget tutorials.",
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Mobile Shop OS Support API",
  });
}
