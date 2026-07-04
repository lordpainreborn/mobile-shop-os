"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Package,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getAdminStats, createShop } from "@/actions/adminActions";

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

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const loadStats = async () => {
    setLoading(true);
    const result = await getAdminStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

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
      loadStats();
    } else {
      setFormError(result.error || "Failed to create shop");
    }
    setFormLoading(false);
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Super Admin Panel</h1>
          <p className="text-slate-500 mt-1">Platform overview and tenant management</p>
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
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Shop"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Shops"
          value={stats.totalShops}
          icon={<Building2 className="h-6 w-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-emerald-600" />}
          color="bg-emerald-100"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="h-6 w-6 text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

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
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
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
