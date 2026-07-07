import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("token_balance, token_expiry")
      .eq("email", email)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { status: "not_found", message: "No profile found for this email" },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiry = new Date(profile.token_expiry);

    if (expiry > now) {
      const remainingMs = expiry.getTime() - now.getTime();
      const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

      return NextResponse.json({
        status: "active",
        remaining_days: remainingDays,
        token_balance: profile.token_balance,
        message: `Your token is valid. ${remainingDays} day(s) remaining.`,
      });
    }

    return NextResponse.json({
      status: "expired",
      message: "Token expired.",
    });
  } catch (error) {
    console.error("[webhook-bot] Error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
