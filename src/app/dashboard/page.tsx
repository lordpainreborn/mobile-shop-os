"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building2,
  Shield,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Unable to load account data.</p>
      </div>
    );
  }

  const initials = user.name?.charAt(0)?.toUpperCase() ?? "U";
  const subDaysLeft = 14;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Account & License
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          သင့်အကောင့်နှင့် License အချက်အလက်များ
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Card 1 — Account Profile */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <User className="w-4 h-4 text-blue-500" />
              Account Profile
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                {initials}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">Shop Owner</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Shop ID</span>
                <span className="font-medium text-slate-800 truncate">{user.shopId}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Email</span>
                <span className="font-medium text-slate-800 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-24 shrink-0">Role</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2 — License Status */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              License & Subscription
            </div>
          </div>
          <div className="p-6 space-y-5">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                ACTIVE LICENSE
              </span>
            </div>

            {/* Days Remaining */}
            <div className="text-center py-4">
              <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {subDaysLeft}
              </p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Days Remaining</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Free Trial Period</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Trial Progress</span>
                <span>{30 - subDaysLeft}/30 days used</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${((30 - subDaysLeft) / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5 pt-1">
              <a
                href="/download"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Windows App (.exe)
              </a>
              <a
                href="https://t.me/LordPainReborn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                ⚡ Renew License via Telegram
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
