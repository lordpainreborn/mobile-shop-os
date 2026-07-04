"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Building2,
  Shield,
  Download,
  ExternalLink,
  Clock,
  Loader2,
  Sparkles,
  Pencil,
  X,
  CheckCircle2,
  AlertCircle,
  Camera,
} from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
  avatarUrl?: string;
  shopName?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=baffc9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffdfbf",
];

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editShopName, setEditShopName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function fetchUser() {
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
        window.location.href = "/login";
      });
  }

  useEffect(() => { fetchUser(); }, []);

  function openEdit() {
    if (!user) return;
    setEditName(user.name);
    setEditShopName(user.shopName ?? "");
    setEditAvatar(user.avatarUrl ?? "");
    setSaveMsg(null);
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, shopName: editShopName, avatarUrl: editAvatar }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMsg({ type: "err", text: data.message || "Update failed." });
        return;
      }
      if (data.user) setUser(data.user);
      setSaveMsg({ type: "ok", text: data.message || "Profile updated." });
      setTimeout(() => setEditing(false), 1200);
    } catch {
      setSaveMsg({ type: "err", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveMsg({ type: "err", text: "File must be under 2MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setEditAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user.email.charAt(0).toUpperCase();
  const subDaysLeft = 14;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/aioms-logo.svg?v=3" alt="AIOMS" className="h-7 w-7 rounded-md" />
            <span className="text-sm font-bold text-slate-800">AIOMS POS</span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">v2.0</span>
          </div>
          <a href="/" className="text-xs text-slate-500 hover:text-slate-700 transition">
            ← Back to Home
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account & License</h1>
          <p className="text-sm text-slate-500 mt-1">သင့်အကောင့်နှင့် License အချက်အလက်များ</p>
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
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="w-4 h-4 text-blue-500" />
                Account Profile
              </div>
              <button
                onClick={openEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                Edit Profile
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.shopName || "Shop Owner"}</p>
                </div>
              </div>
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
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  ACTIVE LICENSE
                </span>
              </div>

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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Edit Profile</h3>
                <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4 mb-3">
                    {editAvatar ? (
                      <img src={editAvatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1.5">Choose a photo:</p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Upload File
                        </button>
                        {PRESET_AVATARS.slice(0, 3).map((url) => (
                          <button
                            key={url}
                            onClick={() => setEditAvatar(url)}
                            className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                              editAvatar === url ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <img src={url} alt="avatar" className="w-full h-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="Or paste an image URL..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                    />
                  </div>
                  {editAvatar && (
                    <button
                      onClick={() => setEditAvatar("")}
                      className="mt-2 text-xs text-red-500 hover:text-red-700 transition cursor-pointer"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                  />
                </div>

                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Shop Name</label>
                  <input
                    type="text"
                    value={editShopName}
                    onChange={(e) => setEditShopName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                    placeholder="My Mobile Shop"
                  />
                </div>

                {/* Save Message */}
                <AnimatePresence>
                  {saveMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 ${
                        saveMsg.type === "ok"
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      {saveMsg.type === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      {saveMsg.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
