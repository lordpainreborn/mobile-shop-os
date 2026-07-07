"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

export async function getSubscriptionStatus(email: string): Promise<{
  success: boolean;
  tokenExpiry?: string;
  tokenBalance?: number;
  error?: string;
}> {
  try {
    const supabase = getSupabaseAdmin();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("token_expiry, token_balance")
      .eq("email", email)
      .single();

    if (error || !profile) {
      return { success: false, error: "Profile not found" };
    }

    return {
      success: true,
      tokenExpiry: profile.token_expiry,
      tokenBalance: profile.token_balance,
    };
  } catch (error: any) {
    console.error("[getSubscriptionStatus] Error:", error);
    return { success: false, error: error.message || "Failed to fetch subscription" };
  }
}

export async function getAvailableTokens(email: string): Promise<{
  success: boolean;
  tokens?: { code: string; durationDays: number; isUsed: boolean }[];
  error?: string;
}> {
  try {
    const supabase = getSupabaseAdmin();

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profileError || !profiles) {
      return { success: false, error: "Profile not found" };
    }

    const { data: tokens, error } = await supabase
      .from("subscription_tokens")
      .select("token_code, duration_days, is_used")
      .eq("user_id", profiles.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      tokens: tokens.map((t) => ({
        code: t.token_code,
        durationDays: t.duration_days,
        isUsed: t.is_used,
      })),
    };
  } catch (error: any) {
    console.error("[getAvailableTokens] Error:", error);
    return { success: false, error: error.message || "Failed to fetch tokens" };
  }
}

export async function redeemToken(email: string, tokenCode: string): Promise<{
  success: boolean;
  newExpiry?: string;
  error?: string;
}> {
  try {
    if (!tokenCode.trim()) {
      return { success: false, error: "Token code is required" };
    }

    const supabase = getSupabaseAdmin();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, token_expiry")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return { success: false, error: "Profile not found" };
    }

    const { data: token, error: tokenError } = await supabase
      .from("subscription_tokens")
      .select("id, duration_days, is_used")
      .eq("token_code", tokenCode.trim().toUpperCase())
      .eq("user_id", profile.id)
      .single();

    if (tokenError || !token) {
      return { success: false, error: "Invalid token code" };
    }

    if (token.is_used) {
      return { success: false, error: "This token has already been redeemed" };
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
      return { success: false, error: updateError.message };
    }

    const { error: markError } = await supabase
      .from("subscription_tokens")
      .update({ is_used: true })
      .eq("id", token.id);

    if (markError) {
      return { success: false, error: markError.message };
    }

    return {
      success: true,
      newExpiry: newExpiry.toISOString(),
    };
  } catch (error: any) {
    console.error("[redeemToken] Error:", error);
    return { success: false, error: error.message || "Failed to redeem token" };
  }
}
