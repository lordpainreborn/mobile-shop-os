"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Wrench,
  Users,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

type DashboardStats = {
  todaySales: number;
  todayProfit: number;
  totalProducts: number;
  lowStockCount: number;
  openTickets: number;
  totalStaff: number;
  recentSales: { id: string; total: number; method: string; time: string }[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        setStats({
          todaySales: 285000,
          todayProfit: 95000,
          totalProducts: 47,
          lowStockCount: 3,
          openTickets: 5,
          totalStaff: data.user?.role === "SUPER_ADMIN" ? 12 : 3,
          recentSales: [
            { id: "1", total: 185000, method: "CASH", time: "10:30 AM" },
            { id: "2", total: 45000, method: "KBZPAY", time: "11:15 AM" },
            { id: "3", total: 120000, method: "CASH", time: "2:00 PM" },
          ],
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your shop performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: `${(stats?.todaySales ?? 0).toLocaleString()} Ks`, icon: TrendingUp, color: "bg-blue-500", trend: "+12%" },
          { label: "Today's Profit", value: `${(stats?.todayProfit ?? 0).toLocaleString()} Ks`, icon: Banknote, color: "bg-emerald-500", trend: "+8%" },
          { label: "Products", value: String(stats?.totalProducts ?? 0), icon: Package, color: "bg-purple-500", sub: `${stats?.lowStockCount ?? 0} low stock` },
          { label: "Open Tickets", value: String(stats?.openTickets ?? 0), icon: Wrench, color: "bg-amber-500", sub: "Pending repairs" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
              {card.trend && (
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                  <ArrowUpRight size={14} />
                  {card.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
            {card.sub && <p className="text-[10px] text-amber-600 font-medium mt-1">{card.sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Recent Sales</h2>
          </div>
          <div className="p-4 space-y-3">
            {stats?.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ShoppingCart size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{sale.total.toLocaleString()} Ks</p>
                    <p className="text-[10px] text-slate-400">{sale.method}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  {sale.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: "New Sale", href: "/sales", color: "bg-blue-500" },
              { label: "Add Product", href: "/products", color: "bg-emerald-500" },
              { label: "New Repair", href: "/repairs", color: "bg-amber-500" },
              { label: "Trade-In", href: "/trade-in", color: "bg-purple-500" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={`${action.color} text-white rounded-xl p-4 text-center font-semibold text-sm hover:opacity-90 transition-opacity`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
