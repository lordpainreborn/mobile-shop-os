"use client";
import React from "react";
import {
  Monitor,
  ShoppingCart,
  BarChart3,
  Package,
  Wifi,
  WifiOff,
  Printer,
  Shield,
  Users,
  Globe,
  Download,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              AIOMS
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#screenshots" className="hover:text-white transition">
              Screenshots
            </a>
            <a href="#download" className="hover:text-white transition">
              Download
            </a>
          </div>
          <a
            href="/login"
            className="px-5 py-2 rounded-lg bg-blue-600 text-sm font-semibold hover:bg-blue-500 transition"
          >
            Web Portal ဝင်ရန်
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              PC & Cloud POS Operating System
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            AIOMS
            <br />
            <span className="text-blue-400">
              အဆင့်မြင့် ဖုန်းဆိုင်သုံး
            </span>
            <br />
            PC & Cloud POS စနစ်
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ဖုန်းဆိုင်လုပ်ငန်းများအတွက် အထူးဒီဇိုင်းဆွဲထားသည့်
            Windows PC Application နှင့် Cloud-based Web Portal တစ်ခုတည်းတွင်
            အရောင်း၊ ပြင်ဆင်ရေး၊ စတော့၊ ဝန်ထမ်း စီမံခန့်ခွဲပါ။
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#download"
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
            >
              <Download className="w-5 h-5" />
              Download Windows PC App (.exe)
            </a>
            <a
              href="/login"
              className="flex items-center gap-3 px-8 py-4 rounded-xl border border-slate-700 bg-slate-800 text-base font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <Globe className="w-5 h-5" />
              Web Portal သို့ ဝင်ရန်
            </a>
          </div>
        </div>
      </section>

      {/* Screenshot Showcase */}
      <section id="screenshots" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ဆော့ဖ်ဝဲလ် လုပ်ဆောင်ချက် နမူနာ မြင်ကွင်းများ
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Desktop PC Application မှ ရရှိနိုင်သည့် အဓိ Screen များ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard Window */}
            <div className="group">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-shadow">
                <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2 font-medium">
                    Dashboard Overview
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    အရှုံးအမြတ်နှင့် ဝင်ငွေ စာရင်းချုပ်
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-400">ယနေ့ အရောင်း</p>
                      <p className="text-lg font-bold text-emerald-400 mt-1">
                        285,000 Ks
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-xs text-slate-400">အမြတ်</p>
                      <p className="text-lg font-bold text-blue-400 mt-1">
                        95,000 Ks
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-2">
                      လစဉ် အရောင်းပြဇယား
                    </p>
                    <div className="flex items-end gap-1 h-16">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-blue-500/60 rounded-t"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* POS Terminal Window */}
            <div className="group">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-shadow">
                <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2 font-medium">
                    POS Terminal
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    ဘောက်ချာ ဖြတ်တောက်သည့် မျက်နှာပြင်
                  </h3>
                  <div className="bg-slate-800 rounded-xl p-3 space-y-2">
                    {[
                      { name: "iPhone 15 Pro", qty: 1, price: "1,850,000" },
                      { name: "Screen Protector", qty: 2, price: "15,000" },
                      { name: "Phone Case", qty: 1, price: "25,000" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-slate-300">
                          {item.name} x{item.qty}
                        </span>
                        <span className="text-white font-medium">
                          {item.price} Ks
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                      <span className="text-sm font-bold text-white">Total</span>
                      <span className="text-sm font-bold text-emerald-400">
                        1,890,000 Ks
                      </span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-emerald-600 text-sm font-semibold hover:bg-emerald-500 transition">
                    ငွေပေးငွေယူ ပြီးမြောက်ရန်
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Window */}
            <div className="group">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-shadow">
                <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2 font-medium">
                    Inventory Control
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    လက်ကျန်ပစ္စည်း ထိန်းချုပ်မှု
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: "iPhone 15 Pro", stock: 12, status: "ok" },
                      { name: "Samsung S24", stock: 3, status: "low" },
                      { name: "Xiaomi 14", stock: 0, status: "out" },
                      { name: "iPad Air", stock: 8, status: "ok" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2"
                      >
                        <span className="text-xs text-slate-300">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium ${
                              item.status === "ok"
                                ? "text-emerald-400"
                                : item.status === "low"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {item.stock} လက်ကျန်
                          </span>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.status === "ok"
                                ? "bg-emerald-400"
                                : item.status === "low"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Core Software Features
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              ဖုန်းဆိုင်လုပ်ငန်း လိုအပ်ချက် အားလုံးအတွက် တစ်နေရာတည်းတွင် ဖြေရှင်းပါ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <WifiOff className="w-6 h-6" />,
                title: "Offline / Online Data Sync",
                desc: "Internet မရှိသည့်အခါလည်း အရောင်းစာရင်းများကို Offline သိမ်းဆည်းပြီး Online ဖြစ်သည့်အခါ Auto Sync လုပ်ပါသည်။",
              },
              {
                icon: <Printer className="w-6 h-6" />,
                title: "Thermal Printer Support",
                desc: "58mm / 80mm Thermal Receipt Printer များနှင့် တိုက်ရိုက်ချိတ်ဆက်၍ ဘောက်ချာများ ချက်ချင်းပုတ်နိုင်ပါသည်။",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Multi-Shop Isolation",
                desc: "ဆိုင်တစ်ဆိုင်ချင်စီ၏ ဒေတာများကို လုံခြုံစွာ သီးခြားခွဲခြားထားပါသည်။",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Employee Role Management",
                desc: "Super Admin, Shop Owner, Staff အဆင့်များဖြင့် ဝန်ထမ်းများ၏ ခွင့်ပြုချက်များကို စီမံခန့်ခွဲပါ။",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Sales & Profit Analytics",
                desc: "နေ့စဉ်၊ အပတ်စဉ်၊ လစဉ် အရောင်းနှင့် အမြတ်စာရင်းများကို Chart များဖြင့် ကြည့်ရှုနိုင်ပါသည်။",
              },
              {
                icon: <Package className="w-6 h-6" />,
                title: "Inventory & Stock Control",
                desc: "ပစ္စည်းဝယ်ယူမှု၊ လက်ကျန်၊ ပြတ်လပ်မှု သတိပေးချက်များကို အလိုအလျောက် စီမံပါ။",
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Repair Ticket Tracking",
                desc: "ဖုန်းပြင်ဆင်ရေး လက်ခံမှုမှ ပြန်လည်ပေးအပ်သည်အထိ Status ကို ခြေရာခံပါ။",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Cloud Web Portal",
                desc: "ဘေကွတ်ရုံမှ မည်သည့် Browser မှ ဝင်ရောက်စီမံနိုင်သည့် Web Dashboard ပါဝင်ပါသည်။",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-14 shadow-2xl">
            <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Windows PC App Download
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Windows 10/11 ပေါ်တွင် တိုက်ရိုက် install လုပ်နိုင်သည့်
              Desktop Application ကို ဒေါင်းလုဒ်ယူပါ။
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/downloads/AIOMS_Setup_v1.0.exe"
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
              >
                <Download className="w-5 h-5" />
                Download AIOMS Setup v1.0 (.exe)
              </a>
              <span className="text-sm text-slate-500">
                Windows 10/11 • 64-bit • 45 MB
              </span>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              {[
                "Free Trial 30 Days",
                "Offline Support",
                "Auto Update",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">AIOMS</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AIOMS. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="/login" className="hover:text-white transition">
              Web Portal
            </a>
            <a href="/signup" className="hover:text-white transition">
              Sign Up
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
