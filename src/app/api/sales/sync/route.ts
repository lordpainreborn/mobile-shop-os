import { NextResponse } from "next/server";
import { syncOfflineSale } from "@/actions/syncActions";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const result = await syncOfflineSale(body as Parameters<typeof syncOfflineSale>[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[sales-sync]", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
