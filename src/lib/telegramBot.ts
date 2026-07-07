import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import { getSupabaseAdmin } from "@/lib/supabase";

const BOT_TOKEN = "8880051823:AAHOHIHxNwo0LU31UqTlIYM8s44QYNZ1AWk";
const ADMIN_TELEGRAM_ID = 123456789; // <-- REPLACE with your actual Telegram user ID

export const bot = new Telegraf(BOT_TOKEN);

bot.command("add_token", async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId || userId !== ADMIN_TELEGRAM_ID) {
    return ctx.reply("⛔ Unauthorized. This command is restricted to the bot admin.");
  }

  const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const parts = text.split(" ");
  if (parts.length < 3) {
    return ctx.reply(
      "Usage: /add_token <email> <days>\n" +
      "Example: /add_token user@example.com 30"
    );
  }

  const email = parts[1].trim().toLowerCase();
  const days = parseInt(parts[2], 10);

  if (!email || isNaN(days) || days < 1) {
    return ctx.reply("Invalid arguments. Usage: /add_token <email> <days>");
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: profile, error: findError } = await supabase
      .from("profiles")
      .select("id, token_expiry")
      .eq("email", email)
      .single();

    if (findError || !profile) {
      return ctx.reply(`❌ Profile not found for email: ${email}`);
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
      return ctx.reply(`❌ Database update failed: ${updateError.message}`);
    }

    await ctx.reply(
      `✅ Token added successfully!\n` +
      `User: ${email}\n` +
      `Days added: ${days}\n` +
      `New expiry: ${newExpiry.toISOString().split("T")[0]}\n` +
      `Previous expiry: ${profile.token_expiry.split("T")[0]}`
    );
  } catch (err: any) {
    console.error("[telegramBot] /add_token error:", err);
    await ctx.reply(`❌ Error: ${err.message || "Internal error"}`);
  }
});

bot.start((ctx: Context) => {
  ctx.reply(
    "🤖 AIOMS Admin Bot\n\n" +
    "Commands:\n" +
    "/add_token <email> <days> - Add subscription days to a user"
  );
});

bot.help((ctx: Context) => {
  ctx.reply(
    "Commands:\n" +
    "/add_token <email> <days> - Add subscription days to a user"
  );
});
