"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function getAllProfiles() {
  try {
    const user = await requireAuth();
    if (user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Only Super Admin can access this" };
    }

    const supabase = getSupabaseAdmin();
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, shop_name, token_balance, token_expiry, created_at, telegram_id")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const now = new Date();
    const enriched = (profiles || []).map((p) => {
      const expiry = new Date(p.token_expiry);
      const remainingMs = expiry.getTime() - now.getTime();
      const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
      return {
        ...p,
        remainingDays: Math.max(0, remainingDays),
        isActive: remainingDays > 0,
      };
    });

    return { success: true, data: enriched };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch profiles" };
  }
}

export async function addDaysToUser(email: string, days: number) {
  try {
    const user = await requireAuth();
    if (user.role !== "SUPER_ADMIN") {
      return { success: false, error: "Only Super Admin can perform this action" };
    }

    if (!email || !days || days < 1) {
      return { success: false, error: "Invalid email or days" };
    }

    const supabase = getSupabaseAdmin();
    const { data: profile, error: findError } = await supabase
      .from("profiles")
      .select("id, token_expiry")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (findError || !profile) {
      return { success: false, error: "Profile not found" };
    }

    const currentExpiry = new Date(profile.token_expiry);
    const now = new Date();
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(newExpiry.getDate() + days);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ token_expiry: newExpiry.toISOString() })
      .eq("id", profile.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/admin");
    return {
      success: true,
      data: {
        email: email.trim().toLowerCase(),
        daysAdded: days,
        newExpiry: newExpiry.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add days" };
  }
}
