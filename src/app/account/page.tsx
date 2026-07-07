"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Building2, Shield, Loader2, Sparkles,
  CheckCircle2, AlertCircle, Server,
  ExternalLink, LogOut, Ticket, ArrowRight, Download,
} from "lucide-react";
import { getSubscriptionStatus, getAvailableTokens } from "@/actions/tokenActions";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
};

type SubscriptionData = {
  tokenExpiry: string;
  remainingDays: number;
  isActive: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [tokens, setTokens] = useState<{ code: string; durationDays: number; isUsed: boolean }[]>([]);
  const [tokenCode, setTokenCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(async (data) => {
        setUser(data.user);
        const subResult = await getSubscriptionStatus(data.user.email);
        if (subResult.success && subResult.tokenExpiry) {
          const expiry = new Date(subResult.tokenExpiry);
          const now = new Date();
          const remainingMs = expiry.getTime() - now.getTime();
          const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
          setSub({
            tokenExpiry: subResult.tokenExpiry,
            remainingDays: Math.max(0, remainingDays),
            isActive: remainingDays > 0,
          });
        }
        const tokResult = await getAvailableTokens(data.user.email);
        if (tokResult.success && tokResult.tokens) {
          setTokens(tokResult.tokens);
        }
      })
      .catch(() => setError("Not authenticated"))
      .finally(() => setLoading(false));
  }, []);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenCode.trim() || !user) return;
    setRedeeming(true);
    setRedeemMsg(null);

    try {
      const res = await fetch("/api/subscription/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_code: tokenCode, email: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setRedeemMsg({ type: "ok", text: data.message || "Token redeemed! Your subscription has been extended." });
        setTokenCode("");
        const subResult = await getSubscriptionStatus(user.email);
        if (subResult.success && subResult.tokenExpiry) {
          const expiry = new Date(subResult.tokenExpiry);
          const now = new Date();
          const remainingMs = expiry.getTime() - now.getTime();
          const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
          setSub({
            tokenExpiry: subResult.tokenExpiry,
            remainingDays: Math.max(0, remainingDays),
            isActive: remainingDays > 0,
          });
        }
      } else {
        setRedeemMsg({ type: "err", text: data.error || "Failed to redeem token" });
      }
    } catch (err: any) {
      setRedeemMsg({ type: "err", text: err.message || "Network error" });
    }
    setRedeeming(false);
  }

  async function handleLogout() {
    try { await getSupabase().auth.signOut(); } catch {}
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">{error || "Redirecting..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your subscription, redeem tokens, and download the EXE</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <User className="w-4 h-4 text-blue-500" />
              Profile
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-20 shrink-0">Shop ID</span>
                <span className="font-medium text-slate-800 truncate">{user.shopId}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-20 shrink-0">Email</span>
                <span className="font-medium text-slate-800 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-20 shrink-0">Role</span>
                <span className="inline-flex rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {user.role}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Subscription Status
            </div>
            <div className="p-6 space-y-4">
              {sub ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      sub.isActive
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}>
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          sub.isActive ? "bg-emerald-400" : "bg-red-400"
                        }`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${
                          sub.isActive ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                      </span>
                      {sub.isActive ? "ACTIVE" : "EXPIRED"}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {sub.remainingDays}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Days Remaining</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Expires: {new Date(sub.tokenExpiry).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, (sub.remainingDays / 365) * 100))}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Loading subscription data...</p>
              )}

              <div className="space-y-2 pt-1">
                <a href="/download"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download AIOMS EXE
                </a>
                <a href="https://t.me/LordPainReborn" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Contact Support via Telegram
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
                <button onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Ticket className="w-4 h-4 text-purple-500" />
            Redeem Token
          </div>
          <div className="p-6">
            <form onSubmit={handleRedeem} className="flex gap-3">
              <input
                type="text"
                value={tokenCode}
                onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                placeholder="Enter token code (e.g. FREE-30D-XXXX)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition font-mono tracking-wider"
              />
              <button
                type="submit"
                disabled={redeeming || !tokenCode.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {redeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Redeem
              </button>
            </form>
            <AnimatePresence>
              {redeemMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`mt-3 flex items-center gap-2 text-sm rounded-xl px-4 py-3 ${
                    redeemMsg.type === "ok"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {redeemMsg.type === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  {redeemMsg.text}
                </motion.div>
              )}
            </AnimatePresence>
            {tokens.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-slate-500 font-medium mb-2">Your Tokens</p>
                <div className="space-y-1.5">
                  {tokens.map((t, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                      t.isUsed ? "bg-slate-50 text-slate-400" : "bg-blue-50 text-blue-700"
                    }`}>
                      <span className="font-mono font-bold">{t.code}</span>
                      <span>{t.durationDays} days {t.isUsed ? "(used)" : "(available)"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <Server className="w-6 h-6 text-blue-200" />
            <h2 className="text-lg font-bold">AIOMS EXE — Full POS System</h2>
          </div>
          <p className="text-sm text-blue-100 mb-4 max-w-2xl">
            To use the POS features, please download and login to our Desktop Application (.exe).
            The Windows EXE handles all POS operations: sales, inventory, repairs, trade-in, warranty,
            expenses, reports, and staff management. This web portal is for account management and subscription only.
          </p>
          <a href="/download"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition shadow-lg"
          >
            <Download className="w-4 h-4" />
            Download EXE
          </a>
        </motion.div>
      </div>
    </div>
  );
}
