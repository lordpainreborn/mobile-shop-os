"use client";
import { useState, useEffect } from "react";
import { RefreshCw, Plus, Loader2, CheckCircle2, XCircle, Package } from "lucide-react";

type TradeInItem = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  deviceModel: string;
  deviceCondition: string;
  imeiNumber: string | null;
  buyInPrice: number;
  resellPrice: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

export default function TradeInPage() {
  const [items, setItems] = useState<TradeInItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    deviceModel: "",
    deviceCondition: "",
    imeiNumber: "",
    buyInPrice: "",
    resellPrice: "",
    notes: "",
  });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/trade-in");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { loadItems(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          buyInPrice: Number(form.buyInPrice),
          resellPrice: form.resellPrice ? Number(form.resellPrice) : undefined,
          customerPhone: form.customerPhone || undefined,
          imeiNumber: form.imeiNumber || undefined,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ customerName: "", customerPhone: "", deviceModel: "", deviceCondition: "", imeiNumber: "", buyInPrice: "", resellPrice: "", notes: "" });
        loadItems();
      }
    } catch { /* ignore */ }
    setFormLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/trade-in", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadItems();
  }

  const statusColors: Record<string, string> = {
    INTAKE: "bg-yellow-100 text-yellow-700 border-yellow-200",
    EVALUATED: "bg-blue-100 text-blue-700 border-blue-200",
    PURCHASED: "bg-purple-100 text-purple-700 border-purple-200",
    RESOLD: "bg-emerald-100 text-emerald-700 border-emerald-200",
    SCRAPPED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Trade-In Devices</h1>
          <p className="text-slate-500 text-sm mt-1">Manage second-hand device intake and resale</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Trade-In
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">New Trade-In Device</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Name *</label>
              <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
              <input type="text" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Device Model *</label>
              <input type="text" value={form.deviceModel} onChange={(e) => setForm({ ...form, deviceModel: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">IMEI</label>
              <input type="text" value={form.imeiNumber} onChange={(e) => setForm({ ...form, imeiNumber: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-mono outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Device Condition *</label>
              <textarea value={form.deviceCondition} onChange={(e) => setForm({ ...form, deviceCondition: e.target.value })} required rows={2} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Buy-In Price (Ks) *</label>
              <input type="number" value={form.buyInPrice} onChange={(e) => setForm({ ...form, buyInPrice: e.target.value })} required min="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Resell Price (Ks)</label>
              <input type="number" value={form.resellPrice} onChange={(e) => setForm({ ...form, resellPrice: e.target.value })} min="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" disabled={formLoading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer">
                {formLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Add Trade-In"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Trade-In Inventory</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Package size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No trade-in devices yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Device</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Buy-In</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Resell</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{item.deviceModel}</p>
                      <p className="text-xs text-slate-400 font-mono">{item.imeiNumber || "No IMEI"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.customerName}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.buyInPrice.toLocaleString()} Ks</td>
                    <td className="px-6 py-4 text-slate-600">{item.resellPrice ? `${item.resellPrice.toLocaleString()} Ks` : "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusColors[item.status] || "bg-slate-100 text-slate-600"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white cursor-pointer"
                      >
                        <option value="INTAKE">INTAKE</option>
                        <option value="EVALUATED">EVALUATED</option>
                        <option value="PURCHASED">PURCHASED</option>
                        <option value="RESOLD">RESOLD</option>
                        <option value="SCRAPPED">SCRAPPED</option>
                      </select>
                    </td>
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
