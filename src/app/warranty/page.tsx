"use client";
import { useState } from "react";
import { Search, Shield, CheckCircle2, XCircle, Loader2, Smartphone } from "lucide-react";

type WarrantyData = {
  imei: string;
  status: string;
  product: string;
  sku: string;
  category: string;
  price: number;
  warrantyMonths: number;
  warrantyRemaining: number;
  warrantyEndDate: string | null;
  isUnderWarranty: boolean;
};

export default function WarrantyPage() {
  const [imei, setImei] = useState("");
  const [data, setData] = useState<WarrantyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!imei.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/warranty?imei=${encodeURIComponent(imei.trim())}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "IMEI not found");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Warranty Tracker</h1>
        <p className="text-slate-500 text-sm mt-1">Enter an IMEI to check warranty status instantly</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter IMEI number..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !imei.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-500 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Lookup
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
          <XCircle size={18} />
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Smartphone className="w-4 h-4 text-blue-500" />
              Device Information
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Smartphone size={28} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{data.product}</h2>
                <p className="text-sm text-slate-500 font-mono">{data.imei}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <p className="text-sm font-bold text-slate-900 capitalize">{data.status.toLowerCase()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <p className="text-sm font-bold text-slate-900">{data.category}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Price</p>
                <p className="text-sm font-bold text-slate-900">{data.price.toLocaleString()} Ks</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Warranty Period</p>
                <p className="text-sm font-bold text-slate-900">{data.warrantyMonths} months</p>
              </div>
            </div>

            <div className={`rounded-xl p-6 text-center ${data.isUnderWarranty ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
              {data.isUnderWarranty ? (
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
              ) : (
                <XCircle size={48} className="text-red-400 mx-auto mb-3" />
              )}
              <h3 className={`text-2xl font-extrabold ${data.isUnderWarranty ? "text-emerald-700" : "text-red-600"}`}>
                {data.isUnderWarranty ? `${data.warrantyRemaining} days remaining` : "Warranty Expired"}
              </h3>
              <p className={`text-sm mt-1 ${data.isUnderWarranty ? "text-emerald-600" : "text-red-500"}`}>
                {data.isUnderWarranty ? "This device is under warranty coverage" : "This device is no longer under warranty"}
              </p>
              {data.warrantyEndDate && (
                <p className="text-xs text-slate-500 mt-2">
                  Expires: {new Date(data.warrantyEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
