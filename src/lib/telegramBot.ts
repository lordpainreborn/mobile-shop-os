import { Telegraf, Context } from "telegraf";
import { Markup } from "telegraf";
import { getSupabaseAdmin } from "@/lib/supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "8880051823:AAHOHIHxNwo0LU31UqTlIYM8s44QYNZ1AWk";
const ADMIN_TELEGRAM_ID = 8223021199;

export const bot = new Telegraf(BOT_TOKEN);

type PendingAction = "link_email" | "admin_add_token" | "admin_broadcast_await_msg" | "admin_broadcast_confirm";
const pendingAction = new Map<number, PendingAction>();
const pendingBroadcastMsg = new Map<number, string>();

// ── sleep helper for rate limiting ──────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Supabase helpers ───────────────────────────────────────────────

async function getProfileByTelegramId(tid: number) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, token_expiry, token_balance")
    .eq("telegram_id", tid)
    .maybeSingle();
  return data;
}

async function getProfileByEmail(email: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, token_expiry, token_balance, telegram_id, shop_name, created_at")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return data;
}

// ── Status helpers ─────────────────────────────────────────────────

function calcStatus(profile: { token_expiry: string; token_balance: number }) {
  const expiry = new Date(profile.token_expiry);
  const now = new Date();
  const remainingMs = expiry.getTime() - now.getTime();
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const isActive = remainingDays > 0;
  return {
    isActive,
    remainingDays: Math.max(0, remainingDays),
    expiryDate: expiry.toLocaleDateString(),
    tokenBalance: profile.token_balance,
  };
}

function statusMessage(status: ReturnType<typeof calcStatus>, email: string) {
  const emoji = status.isActive ? "✅" : "❌";
  return (
    `${emoji} *Subscription Status*\n\n` +
    `Email: \`${email}\`\n` +
    `Status: *${status.isActive ? "Active" : "Expired"}*\n` +
    `Expires: \`${status.expiryDate}\`\n` +
    `Days remaining: \`${status.remainingDays}\`\n` +
    `Token balance: \`${status.tokenBalance}\``
  );
}

function emailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── /start ──────────────────────────────────────────────────────────

bot.start(async (ctx: Context) => {
  const isAdmin = ctx.from?.id === ADMIN_TELEGRAM_ID;

  if (isAdmin) {
    return ctx.reply(
      "🛠️ *Admin Panel — Tech LP Bot*\n\n" +
      "Use the buttons below to manage subscriptions.",
      {
        parse_mode: "Markdown",
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback("➕ Add Token", "admin_add_token")],
          [Markup.button.callback("👥 View All Users", "admin_view_users")],
          [Markup.button.callback("📢 Broadcast Notice", "admin_broadcast")],
          [Markup.button.callback("📊 Platform Stats", "admin_stats")],
          [Markup.button.url("🌐 Web Portal", "https://mobile-shop-kirrh2dtu-lord-pain.vercel.app/account")],
        ]).reply_markup,
      },
    );
  }

  // Regular user
  const linked = ctx.from?.id ? await getProfileByTelegramId(ctx.from.id) : null;
  const buttons = [
    [Markup.button.callback("🔍 Check My Status", "check_status")],
    [Markup.button.url("🌐 Visit Web Portal", "https://mobile-shop-kirrh2dtu-lord-pain.vercel.app/account")],
  ];

  ctx.reply(
    "Welcome to Tech LP All-In-One Service Bot! 🚀\n\n" +
    "I help you manage your token subscriptions easily.\n" +
    (linked ? "✅ Your Telegram is linked. Tap *Check My Status* below." : "Tap *Check My Status* to link your account."),
    {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard(buttons).reply_markup,
    },
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
      "🔹 `/add_token <email> <days>` — Add subscription days",
      "🔹 `/broadcast <message>` — Send a notice to all users",
      "🔹 `/stats` — View platform subscription statistics",
      "",
      "💡 *Tip:* Use the Admin Panel in /start for interactive tools.",
    );
  } else {
    lines.push("💡 Tap *Check My Status* on /start to check your subscription.");
  }

  ctx.reply(lines.join("\n"), { parse_mode: "Markdown" });
});

// ── /add_token (admin only) ────────────────────────────────────────

bot.command("add_token", async (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.reply("⛔ Access Denied.");
  }

  if (!ctx.message || !("text" in ctx.message)) return;
  const text = ctx.message.text;
  const parts = text.split(/\s+/);
  if (parts.length < 3) {
    return ctx.reply("Usage: /add_token <email> <days>\nExample: /add_token user@example.com 30");
  }

  const email = parts[1].trim().toLowerCase();
  const days = parseInt(parts[2], 10);
  if (!email || isNaN(days) || days < 1) {
    return ctx.reply("Invalid arguments. Usage: /add_token <email> <days>");
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, token_expiry")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return ctx.reply("Email not found. Please register first on the web portal.");
    }

    const base = Math.max(new Date(profile.token_expiry).getTime(), Date.now());
    const newExpiry = new Date(base);
    newExpiry.setDate(newExpiry.getDate() + days);

    await supabase.from("profiles").update({ token_expiry: newExpiry.toISOString() }).eq("id", profile.id);

    ctx.reply(
      `✅ Token added!\nUser: \`${email}\`\nDays: ${days}\nNew expiry: ${newExpiry.toISOString().split("T")[0]}`,
      { parse_mode: "Markdown" },
    );
  } catch (err: any) {
    console.error("[add_token]", err);
    ctx.reply(`❌ Error: ${err.message || "Internal error"}`);
  }
});

// ── /broadcast (admin only) ────────────────────────────────────────

bot.command("broadcast", async (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.reply("⛔ Access Denied.");
  }

  if (!ctx.message || !("text" in ctx.message)) return;
  const text2 = ctx.message.text;
  const msg2 = text2.slice("/broadcast".length).trim();
  if (!msg2) {
    return ctx.reply("Usage: /broadcast <message>\nExample: /broadcast Server maintenance tonight at 2AM.");
  }

  // Confirmation step
  pendingBroadcastMsg.set(ADMIN_TELEGRAM_ID, msg2);
  pendingAction.set(ADMIN_TELEGRAM_ID, "admin_broadcast_confirm");

  ctx.reply(
    `⚠️ *Confirm Broadcast*\n\nYou are about to send this message to *all linked users*:\n\n${msg2}\n\n` +
    `Reply with \`yes\` to confirm, or \`no\` /cancel to abort.`,
    { parse_mode: "Markdown" },
  );
});

// ── /stats (admin only) ────────────────────────────────────────────

bot.command("stats", async (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.reply("⛔ Access Denied.");
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: all } = await supabase.from("profiles").select("token_expiry, telegram_id");

    if (!all || all.length === 0) {
      return ctx.reply("No users found.");
    }

    const now = new Date();
    let active = 0;
    let expired = 0;
    let linked = 0;
    for (const p of all) {
      if (new Date(p.token_expiry) > now) active++;
      else expired++;
      if (p.telegram_id) linked++;
    }

    ctx.reply(
      "📊 *Platform Statistics*\n\n" +
      `Total users: \`${all.length}\`\n` +
      `Active subscriptions: \`${active}\`\n` +
      `Expired subscriptions: \`${expired}\`\n` +
      `Telegram linked: \`${linked}\`\n` +
      `Telegram unlinked: \`${all.length - linked}\``,
      { parse_mode: "Markdown" },
    );
  } catch (err: any) {
    console.error("[stats]", err);
    ctx.reply(`❌ Error: ${err.message || "Internal error"}`);
  }
});

// ── Callback: Admin — Add Token prompt ─────────────────────────────

bot.action("admin_add_token", (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.answerCbQuery("⛔ Access Denied.");
  }
  pendingAction.set(ctx.from.id, "admin_add_token");
  ctx.reply(
    "✏️ Enter email and days like:\n`email@example.com 30`\n\n_Send /cancel to abort._",
    { parse_mode: "Markdown" },
  );
  ctx.answerCbQuery();
});

// ── Callback: Admin — View All Users ───────────────────────────────

bot.action("admin_view_users", async (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.answerCbQuery("⛔ Access Denied.");
  }
  ctx.answerCbQuery();

  try {
    const supabase = getSupabaseAdmin();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("email, shop_name, token_expiry, token_balance, telegram_id")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!profiles || profiles.length === 0) {
      return ctx.reply("No users found.");
    }

    const lines = profiles.map(
      (p: { email: string; shop_name: string | null; token_expiry: string; token_balance: number; telegram_id: number | null }, i: number) => {
        const status = calcStatus({ token_expiry: p.token_expiry, token_balance: p.token_balance });
        const linked = p.telegram_id ? "✅L" : "❌U";
        return (
          `${i + 1}. \`${p.email}\`\n` +
          `   Shop: ${p.shop_name || "-"} | Exp: ${status.expiryDate} | ${status.remainingDays}d | ${linked}`
        );
      },
    );

    ctx.reply(`👥 *Users (latest 20)*\n\n${lines.join("\n")}`, { parse_mode: "Markdown" });
  } catch (err: any) {
    console.error("[admin_view_users]", err);
    ctx.reply(`❌ Error: ${err.message}`);
  }
});

// ── Callback: Admin — Broadcast prompt ─────────────────────────────

bot.action("admin_broadcast", (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.answerCbQuery("⛔ Access Denied.");
  }
  pendingAction.set(ctx.from.id, "admin_broadcast_await_msg");
  ctx.reply(
    "📢 Send the message you want to broadcast to all users.\n\n_Send /cancel to abort._",
    { parse_mode: "Markdown" },
  );
  ctx.answerCbQuery();
});

// ── Callback: Admin — Platform Stats ───────────────────────────────

bot.action("admin_stats", async (ctx: Context) => {
  if (ctx.from?.id !== ADMIN_TELEGRAM_ID) {
    return ctx.answerCbQuery("⛔ Access Denied.");
  }
  ctx.answerCbQuery();

  try {
    const supabase = getSupabaseAdmin();
    const { data: all } = await supabase.from("profiles").select("token_expiry, telegram_id");

    if (!all || all.length === 0) {
      return ctx.reply("No users found.");
    }

    const now = new Date();
    let active = 0;
    let expired = 0;
    let linked = 0;
    for (const p of all) {
      if (new Date(p.token_expiry) > now) active++;
      else expired++;
      if (p.telegram_id) linked++;
    }

    ctx.reply(
      "📊 *Platform Statistics*\n\n" +
      `Total users: \`${all.length}\`\n` +
      `Active subscriptions: \`${active}\`\n` +
      `Expired subscriptions: \`${expired}\`\n` +
      `Telegram linked: \`${linked}\`\n` +
      `Telegram unlinked: \`${all.length - linked}\``,
      { parse_mode: "Markdown" },
    );
  } catch (err: any) {
    console.error("[admin_stats]", err);
    ctx.reply(`❌ Error: ${err.message}`);
  }
});

// ── Callback: User — Check My Status ───────────────────────────────

bot.action("check_status", async (ctx: Context) => {
  const chatId = ctx.from?.id;
  if (!chatId) return;
  ctx.answerCbQuery();

  const profile = await getProfileByTelegramId(chatId);
  if (profile) {
    const status = calcStatus(profile);
    return ctx.reply(statusMessage(status, profile.email!), { parse_mode: "Markdown" });
  }

  pendingAction.set(chatId, "link_email");
  ctx.reply(
    "📧 Please send your registered email address to link your account.\n\n_Send /cancel to abort._",
    { parse_mode: "Markdown" },
  );
});

// ── Core broadcast function (with rate limiting) ───────────────────

async function executeBroadcast(ctx: Context, msg: string) {
  await ctx.reply("📤 Broadcasting... This may take a moment.");

  try {
    const supabase = getSupabaseAdmin();
    const { data: recipients } = await supabase
      .from("profiles")
      .select("telegram_id")
      .not("telegram_id", "is", null);

    if (!recipients || recipients.length === 0) {
      return ctx.reply("No users have linked their Telegram yet.");
    }

    let sent = 0;
    let failed = 0;
    for (const r of recipients) {
      // Skip self
      if (r.telegram_id === ADMIN_TELEGRAM_ID) continue;
      try {
        await ctx.telegram.sendMessage(r.telegram_id, `📢 *Admin Notice*\n\n${msg}`, {
          parse_mode: "Markdown",
        });
        sent++;
      } catch {
        failed++;
      }
      // Rate-limit: max 20 msg/sec
      if (sent % 20 === 0) await sleep(1000);
    }

    ctx.reply(`✅ Broadcast complete.\nSent: ${sent}\nFailed: ${failed}`);
  } catch (err: any) {
    console.error("[broadcast]", err);
    ctx.reply(`❌ Error: ${err.message || "Internal error"}`);
  }
}

// ── Text handler ───────────────────────────────────────────────────

bot.on("text", async (ctx: Context) => {
  const chatId = ctx.from?.id;
  if (!chatId) return;
  if (!ctx.message || !("text" in ctx.message)) return;

  const text = ctx.message.text.trim();
  const action = pendingAction.get(chatId);
  if (!action) return;

  // Cancel
  if (text.toLowerCase() === "/cancel" || text.toLowerCase() === "no") {
    pendingAction.delete(chatId);
    pendingBroadcastMsg.delete(chatId);
    return ctx.reply("Cancelled. Use /start to begin again.");
  }

  pendingAction.delete(chatId);

  if (action === "link_email") {
    if (!emailValid(text)) {
      pendingAction.set(chatId, "link_email");
      return ctx.reply("❌ Invalid email format. Try again, or send /cancel.");
    }

    const email = text.toLowerCase();
    const profile = await getProfileByEmail(email);
    if (!profile) {
      pendingAction.set(chatId, "link_email");
      return ctx.reply(
        "Email not found. Please register first on the web portal (https://mobile-shop-kirrh2dtu-lord-pain.vercel.app/signup).\n\nSend /cancel to stop.",
      );
    }

    // Link telegram_id (if not already linked to a different account)
    if (profile.telegram_id && profile.telegram_id !== chatId) {
      return ctx.reply(
        "❌ This email is already linked to another Telegram account. Contact support if this is a mistake.",
      );
    }

    const supabase = getSupabaseAdmin();
    await supabase.from("profiles").update({ telegram_id: chatId }).eq("id", profile.id);

    const status = calcStatus(profile);
    ctx.reply(`✅ *Account Linked!*\n\n${statusMessage(status, email)}`, { parse_mode: "Markdown" });
  } else if (action === "admin_add_token" && chatId === ADMIN_TELEGRAM_ID) {
    const parts = text.split(/\s+/);
    if (parts.length < 2) {
      pendingAction.set(chatId, "admin_add_token");
      return ctx.reply("Please provide both email and days. Example: `email@example.com 30`");
    }

    const email = parts[0].trim().toLowerCase();
    const days = parseInt(parts[1], 10);
    if (!email || isNaN(days) || days < 1) {
      pendingAction.set(chatId, "admin_add_token");
      return ctx.reply("Invalid. Usage: `email@example.com 30`");
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, token_expiry")
        .eq("email", email)
        .maybeSingle();

      if (!profile) {
        pendingAction.set(chatId, "admin_add_token");
        return ctx.reply("Email not found. Please register first on the web portal.");
      }

      const base = Math.max(new Date(profile.token_expiry).getTime(), Date.now());
      const newExpiry = new Date(base);
      newExpiry.setDate(newExpiry.getDate() + days);
      await supabase.from("profiles").update({ token_expiry: newExpiry.toISOString() }).eq("id", profile.id);

      ctx.reply(
        `✅ Token added!\nUser: \`${email}\`\nDays: ${days}\nNew expiry: ${newExpiry.toISOString().split("T")[0]}`,
        { parse_mode: "Markdown" },
      );
    } catch (err: any) {
      console.error("[admin_add_token]", err);
      ctx.reply(`❌ Error: ${err.message}`);
    }
  } else if (action === "admin_broadcast_await_msg" && chatId === ADMIN_TELEGRAM_ID) {
    // Store message and ask for confirmation
    pendingBroadcastMsg.set(chatId, text);
    pendingAction.set(chatId, "admin_broadcast_confirm");

    ctx.reply(
      `⚠️ *Confirm Broadcast*\n\nYou are about to send this message to *all linked users*:\n\n${text}\n\n` +
      `Reply with \`yes\` to confirm, or \`no\` /cancel to abort.`,
      { parse_mode: "Markdown" },
    );
  } else if (action === "admin_broadcast_confirm" && chatId === ADMIN_TELEGRAM_ID) {
    const lower = text.toLowerCase();
    if (lower === "yes" || lower === "y") {
      const msg = pendingBroadcastMsg.get(chatId) ?? "";
      pendingBroadcastMsg.delete(chatId);
      await executeBroadcast(ctx, msg);
    } else {
      pendingBroadcastMsg.delete(chatId);
      ctx.reply("Broadcast cancelled.");
    }
  }
});
