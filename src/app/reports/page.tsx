"use client";
import { useState } from "react";
import { BarChart3, Loader2, Calendar, TrendingUp, Banknote, Wallet, CreditCard } from "lucide-react";

type DailyReport = {
  date: string;
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  totalCost: number;
  splitPayments: { cash: number; kbzPay: number; cbPay: number; wavePay: number };
  expenseBreakdown: Record<string, number>;
  salesCount: number;
  expensesCount: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  async function loadReport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/daily?date=${selectedDate}`);
      const data = await res.json();
      if (data.success) setReport(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Financial Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Daily profit & loss and payment breakdown</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
          <button
            onClick={loadReport}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-500 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
            Generate Report
          </button>
        </div>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Sales", value: `${report.totalSales.toLocaleString()} Ks`, icon: TrendingUp, color: "bg-blue-500" },
              { label: "Total Expenses", value: `${report.totalExpenses.toLocaleString()} Ks`, icon: Banknote, color: "bg-red-500" },
              { label: "Net Profit", value: `${report.totalProfit.toLocaleString()} Ks`, icon: TrendingUp, color: report.totalProfit >= 0 ? "bg-emerald-500" : "bg-red-500" },
              { label: "Transactions", value: String(report.salesCount), icon: BarChart3, color: "bg-purple-500" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon size={20} className="text-white" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Split Payment Breakdown</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Cash", value: report.splitPayments.cash, icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "KBZPay", value: report.splitPayments.kbzPay, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "CB Pay", value: report.splitPayments.cbPay, icon: CreditCard, color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "Wave", value: report.splitPayments.wavePay, icon: Wallet, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon size={16} className={item.color} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.value.toLocaleString()} Ks</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Expense Breakdown</h2>
              </div>
              <div className="p-6 space-y-4">
                {Object.entries(report.expenseBreakdown).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No expenses today</p>
                ) : (
                  Object.entries(report.expenseBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{category}</span>
                      <span className="text-sm font-bold text-red-600">{amount.toLocaleString()} Ks</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
