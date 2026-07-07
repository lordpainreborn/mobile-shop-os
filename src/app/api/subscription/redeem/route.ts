import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const tokenCode = String(body?.token_code ?? "").trim().toUpperCase();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!tokenCode || !email) {
      return NextResponse.json(
        { success: false, error: "token_code and email are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, token_expiry")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found for this email" },
        { status: 404 }
      );
    }

    const { data: token, error: tokenError } = await supabase
      .from("subscription_tokens")
      .select("id, duration_days, is_used")
      .eq("token_code", tokenCode)
      .single();

    if (tokenError || !token) {
      return NextResponse.json(
        { success: false, error: "Invalid token code" },
        { status: 400 }
      );
    }

    if (token.is_used) {
      return NextResponse.json(
        { success: false, error: "This token has already been redeemed" },
        { status: 400 }
      );
    }

    const currentExpiry = new Date(profile.token_expiry);
    const now = new Date();
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(newExpiry.getDate() + token.duration_days);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ token_expiry: newExpiry.toISOString() })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    const { error: markError } = await supabase
      .from("subscription_tokens")
      .update({ is_used: true })
      .eq("id", token.id);

    if (markError) {
      return NextResponse.json(
        { success: false, error: markError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Token redeemed! Subscription extended by ${token.duration_days} days. New expiry: ${newExpiry.toISOString().split("T")[0]}`,
      newExpiry: newExpiry.toISOString(),
    });
  } catch (error: any) {
    console.error("[redeem-token] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
