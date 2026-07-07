import { Telegraf, Context } from "telegraf";
import { Markup } from "telegraf";
import { getSupabaseAdmin } from "@/lib/supabase";

const BOT_TOKEN = "8880051823:AAHOHIHxNwo0LU31UqTlIYM8s44QYNZ1AWk";
const ADMIN_TELEGRAM_ID = 8223021199;

export const bot = new Telegraf(BOT_TOKEN);

const pendingStatusCheck = new Map<number, true>();

// ── /start ──────────────────────────────────────────────────────────
bot.start((ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback("🔍 Check My Status", "check_status"),
    Markup.button.url("🌐 Visit Web Portal", "https://mobile-shop-kirrh2dtu-lord-pain.vercel.app/account"),
  ]);

  ctx.reply(
    "Welcome to Tech LP All-In-One Service Bot! 🚀\n\n" +
    "I help you manage your token subscriptions easily.\n" +
    "Use the buttons below or type /help to see all commands.",
    { reply_markup: keyboard.reply_markup }
  );
});

// ── /help ──────────────────────────────────────────────────────────
bot.help((ctx: Context) => {
  const isAdmin = ctx.from?.id === ADMIN_TELEGRAM_ID;
  const lines: string[] = [
    "📋 *Available Commands*",
    "",
    "🔹 `/start` — Show welcome screen with quick actions",
    "🔹 `/help` — Show this help message",
    "",
  ];

  if (isAdmin) {
    lines.push(
      "━━━ *Admin Control* ━━━",
      "",
      "🔹 `/add_token <email> <days>` — Add subscription days to a user",
      "   _Example: /add_token user@example.com 30_",
      "",
      "💡 *Tip:* Use the Web Portal at /account for full management.",
    );
  } else {
    lines.push(
      "💡 Use the [Check My Status] button on /start to check your subscription.",
    );
  }

  ctx.reply(lines.join("\n"), { parse_mode: "Markdown" });
});

// ── /add_token (admin only) ────────────────────────────────────────
bot.command("add_token", async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId || userId !== ADMIN_TELEGRAM_ID) {
    return ctx.reply("⛔ Unauthorized. This command is restricted to the bot admin.");
  }

  const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  const parts = text.split(/\s+/);
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

// ── Callback: Check My Status ──────────────────────────────────────
bot.action("check_status", (ctx: Context) => {
  const chatId = ctx.from?.id;
  if (!chatId) return;

  pendingStatusCheck.set(chatId, true);
  ctx.reply(
    "📧 Please enter the email address registered with your account.\n\n" +
    "_Type your email below, or send /cancel to abort._",
    { parse_mode: "Markdown" }
  );
});

// ── Handle text for status check ───────────────────────────────────
bot.on("text", async (ctx: Context) => {
  const chatId = ctx.from?.id;
  if (!chatId || !pendingStatusCheck.has(chatId)) return;
  if (!ctx.message || !("text" in ctx.message)) return;

  const text = ctx.message.text.trim();

  // Allow cancel
  if (text.toLowerCase() === "/cancel") {
    pendingStatusCheck.delete(chatId);
    return ctx.reply("Cancelled. Use /start to begin again.");
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(text)) {
    return ctx.reply("❌ That doesn't look like a valid email. Please try again, or send /cancel.");
  }

  pendingStatusCheck.delete(chatId);

  try {
    const supabase = getSupabaseAdmin();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("token_expiry, token_balance")
      .eq("email", text.toLowerCase())
      .single();

    if (error || !profile) {
      return ctx.reply("❌ No profile found for that email. Please check and try again.");
    }

    const expiry = new Date(profile.token_expiry);
    const now = new Date();
    const remainingMs = expiry.getTime() - now.getTime();
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const isActive = remainingDays > 0;

    const statusEmoji = isActive ? "✅" : "❌";
    const statusText = isActive ? "Active" : "Expired";

    await ctx.reply(
      `${statusEmoji} *Subscription Status*\n\n` +
      `Email: \`${text.toLowerCase()}\`\n` +
      `Status: *${statusText}*\n` +
      `Expires: \`${expiry.toLocaleDateString()}\`\n` +
      `Days remaining: \`${Math.max(0, remainingDays)}\`\n` +
      `Token balance: \`${profile.token_balance}\``,
      { parse_mode: "Markdown" }
    );
  } catch (err: any) {
    console.error("[telegramBot] status check error:", err);
    await ctx.reply(`❌ Error: ${err.message || "Internal error"}`);
  }
});
