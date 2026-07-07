"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Users,
  Package,
  Plus,
  Loader2,
  ExternalLink,
  Calendar,
  Mail,
  Smartphone,
  Sparkles,
  Shield,
} from "lucide-react";
import { getAdminStats, createShop } from "@/actions/adminActions";
import { getAllProfiles, addDaysToUser } from "@/actions/adminSubscriptionActions";

type AdminStats = {
  totalShops: number;
  totalUsers: number;
  totalProducts: number;
  shops: {
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    createdAt: Date;
    _count: { users: number; products: number };
  }[];
};

type Profile = {
  id: string;
  email: string;
  shop_name: string | null;
  token_balance: number;
  token_expiry: string;
  created_at: string;
  telegram_id: number | null;
  remainingDays: number;
  isActive: boolean;
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [profilesTab, setProfilesTab] = useState(true);
  const [addingDays, setAddingDays] = useState<string | null>(null);
  const [addDaysMsg, setAddDaysMsg] = useState<{ email: string; text: string } | null>(null);
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const [statsResult, profilesResult] = await Promise.all([
      getAdminStats(),
      getAllProfiles(),
    ]);
    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
    if (profilesResult.success && profilesResult.data) {
      setProfiles(profilesResult.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    const result = await createShop(form);
    if (result.success) {
      setFormSuccess(`Shop "${form.shopName}" created successfully!`);
      setForm({ shopName: "", ownerName: "", ownerEmail: "", ownerPassword: "" });
      setShowForm(false);
      loadData();
    } else {
      setFormError(result.error || "Failed to create shop");
    }
    setFormLoading(false);
  };

  const handleAddDays = async (email: string, days: number) => {
    setAddingDays(email);
    setAddDaysMsg(null);
    const result = await addDaysToUser(email, days);
    if (result.success) {
      setAddDaysMsg({ email, text: `Added ${days} days successfully!` });
      loadData();
    } else {
      setAddDaysMsg({ email, text: result.error || "Failed" });
    }
    setAddingDays(null);
    setTimeout(() => setAddDaysMsg(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-red-600 py-12">
        Failed to load admin data. You may not have Super Admin access.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Super Admin Panel</h1>
          <p className="text-slate-500 mt-1">Platform overview, tenant management, and subscription control</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Shop
        </button>
      </div>

      {formSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
          {formSuccess}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Create New Shop / Tenant</h2>
          <form onSubmit={handleCreateShop} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Shop Name</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="e.g. Yangon Mobile Hub"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Owner Name</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                placeholder="e.g. Aung Min"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Owner Email</label>
              <input
                type="email"
                value={form.ownerEmail}
                onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                placeholder="owner@shop.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Password</label>
              <input
                type="password"
                value={form.ownerPassword}
                onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {formError && (
              <div className="md:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                {formError}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(""); }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {formLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                ) : (
                  "Create Shop"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Shops" value={stats.totalShops} icon={<Building2 className="h-6 w-6 text-blue-600" />} color="bg-blue-100" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-6 w-6 text-emerald-600" />} color="bg-emerald-100" />
        <StatCard title="Total Products" value={stats.totalProducts} icon={<Package className="h-6 w-6 text-purple-600" />} color="bg-purple-100" />
        <StatCard title="Telegram Linked" value={profiles.filter((p) => p.telegram_id).length} icon={<Smartphone className="h-6 w-6 text-amber-600" />} color="bg-amber-100" />
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setProfilesTab(true)}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
            profilesTab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Subscription Management
        </button>
        <button
          onClick={() => setProfilesTab(false)}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
            !profilesTab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Registered Shops
        </button>
      </div>

      {profilesTab ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">User Subscriptions</h2>
            <span className="text-xs text-slate-400">{profiles.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Shop</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Expiry</th>
                  <th className="text-center px-6 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-center px-6 py-3 font-semibold text-slate-600">Days</th>
                  <th className="text-center px-6 py-3 font-semibold text-slate-600">Telegram</th>
                  <th className="text-center px-6 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-900 font-medium">{p.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.shop_name || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-700">{new Date(p.token_expiry).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        p.isActive
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {p.isActive ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${p.isActive ? "text-slate-900" : "text-red-600"}`}>
                        {p.remainingDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.telegram_id
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : "bg-slate-100 border border-slate-200 text-slate-400"
                      }`}>
                        <Smartphone className="w-2.5 h-2.5" />
                        {p.telegram_id ? "Linked" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAddDays(p.email, 30)}
                          disabled={addingDays === p.email}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 cursor-pointer"
                        >
                          {addingDays === p.email ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          +30 Days
                        </button>
                        <button
                          onClick={() => handleAddDays(p.email, 365)}
                          disabled={addingDays === p.email}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50 cursor-pointer"
                        >
                          <Shield className="w-3 h-3" />
                          +1 Year
                        </button>
                        {addDaysMsg?.email === p.email && (
                          <span className={`text-[10px] font-medium ${addDaysMsg.text.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
                            {addDaysMsg.text}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Registered Shops</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Shop Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Owner</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Phone</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Users</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Products</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.shops.map((shop) => (
                  <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{shop.name}</td>
                    <td className="px-6 py-4 text-slate-600">{shop.ownerName}</td>
                    <td className="px-6 py-4 text-slate-600">{shop.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {shop._count.users}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        {shop._count.products}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {stats.shops.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No shops registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <ExternalLink className="w-5 h-5 text-blue-300" />
          <h2 className="text-lg font-bold">Telegram Admin Bot</h2>
        </div>
        <p className="text-sm text-slate-300 mb-3 max-w-2xl">
          You can also manage subscriptions via the Telegram bot. Send <code className="bg-slate-700 px-1.5 py-0.5 rounded text-blue-300 text-xs">/add_token &lt;email&gt; &lt;days&gt;</code> to the bot.
        </p>
        <a
          href="https://t.me/aioms_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition shadow-lg"
        >
          Open Telegram Bot
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-extrabold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
