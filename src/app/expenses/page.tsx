"use client";
import { useState, useEffect } from "react";
import { Banknote, Plus, Loader2, Trash2 } from "lucide-react";

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
};

const CATEGORIES = ["Rent", "Utilities", "Salaries", "Supplies", "Marketing", "Maintenance", "Other"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "Other" });

  async function loadExpenses() {
    setLoading(true);
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      if (data.success) setExpenses(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { loadExpenses(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ description: "", amount: "", category: "Other" });
        loadExpenses();
      }
    } catch { /* ignore */ }
    setFormLoading(false);
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Expenses</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage shop expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <Banknote size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Expenses</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalExpenses.toLocaleString()} Ks</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">New Expense</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (Ks) *</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" disabled={formLoading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer">
                {formLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Banknote size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No expenses recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Description</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Amount</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{expense.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-red-600">{expense.amount.toLocaleString()} Ks</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(expense.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
