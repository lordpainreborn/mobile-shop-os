"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  ShoppingCart,
  BarChart3,
  Package,
  WifiOff,
  Printer,
  Shield,
  Users,
  Globe,
  Download,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Phone,
  Send,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 80, damping: 15 };

const zoomIn = {
  hidden: { opacity: 0, scale: 0.75, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 15 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const tabContent = [
  {
    id: "dashboard",
    label: "Dashboard Overview",
    icon: <BarChart3 className="w-4 h-4" />,
    title: "အရှုံးအမြတ်နှင့် ဝင်ငွေ စာရင်းချုပ်",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50"
          >
            <p className="text-xs text-slate-400">ယနေ့ အရောင်း</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              285,000 Ks
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50"
          >
            <p className="text-xs text-slate-400">အမြတ်</p>
            <p className="text-2xl font-extrabold text-blue-400 mt-1">
              95,000 Ks
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 origin-bottom"
        >
          <p className="text-xs text-slate-400 mb-3">လစဉ် အရောင်းပြဇယား</p>
          <div className="flex items-end gap-1.5 h-20">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.4 + i * 0.03, duration: 0.4, type: "spring", stiffness: 120 }}
                className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
              />
            ))}
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "pos",
    label: "POS Terminal",
    icon: <ShoppingCart className="w-4 h-4" />,
    title: "ဘောက်ချာ ဖြတ်တောက်သည့် မျက်နှာပြင်",
    content: (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50 space-y-3"
        >
          {[
            { name: "iPhone 15 Pro", qty: 1, price: "1,850,000" },
            { name: "Screen Protector", qty: 2, price: "15,000" },
            { name: "Phone Case", qty: 1, price: "25,000" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="flex justify-between text-sm"
            >
              <span className="text-slate-300">
                {item.name} ×{item.qty}
              </span>
              <span className="text-white font-medium">{item.price} Ks</span>
            </motion.div>
          ))}
          <div className="border-t border-slate-700 pt-3 flex justify-between">
            <span className="font-bold text-white">Total</span>
            <span className="font-bold text-emerald-400">1,890,000 Ks</span>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3 rounded-xl bg-emerald-600 text-sm font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
        >
          ငွေပေးငွေယူ ပြီးမြောက်ရန်
        </motion.button>
      </div>
    ),
  },
  {
    id: "inventory",
    label: "Inventory Control",
    icon: <Package className="w-4 h-4" />,
    title: "လက်ကျန်ပစ္စည်း ထိန်းချုပ်မှု",
    content: (
      <div className="space-y-2.5">
        {[
          { name: "iPhone 15 Pro", stock: 12, status: "ok" },
          { name: "Samsung S24", stock: 3, status: "low" },
          { name: "Xiaomi 14", stock: 0, status: "out" },
          { name: "iPad Air", stock: 8, status: "ok" },
          { name: "AirPods Pro", stock: 15, status: "ok" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.08 }}
            className="flex items-center justify-between bg-slate-800/80 rounded-xl px-4 py-3 border border-slate-700/50"
          >
            <span className="text-sm text-slate-300">{item.name}</span>
            <div className="flex items-center gap-2.5">
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
          </motion.div>
        ))}
      </div>
    ),
  },
];

const features = [
  {
    icon: <WifiOff className="w-5 h-5" />,
    title: "Offline / Online Sync",
    desc: "Internet မရှိသည့်အခါလည်း Offline သိမ်းဆည်းပြီး Auto Sync လုပ်ပါသည်။",
  },
  {
    icon: <Printer className="w-5 h-5" />,
    title: "Thermal Printer",
    desc: "58mm / 80mm Thermal Receipt Printer များနှင့် ချိတ်ဆက်၍ ဘောက်ချာ ပုတ်နိုင်ပါသည်။",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Multi-Shop Isolation",
    desc: "ဆိုင်တစ်ဆိုင်ချင်စီ၏ ဒေတာများကို လုံခြုံစွာ သီးခြားခွဲခြားထားပါသည်။",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Staff Role Management",
    desc: "Super Admin, Shop Owner, Staff အဆင့်များဖြင့် ခွင့်ပြုချက်များ စီမံခန့်ခွဲပါ။",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Sales Analytics",
    desc: "နေ့စဉ်၊ အပတ်စဉ်၊ လစဉ် အရောင်းနှင့် အမြတ်စာရင်းကို Chart ဖြင့် ကြည့်ပါ။",
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: "Inventory Control",
    desc: "ပစ္စည်းဝယ်ယူမှု၊ လက်ကျန်၊ ပြတ်လပ်မှု သတိပေးချက်များ အလိုအလျောက် စီမံပါ။",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "30-day trial",
    features: ["1 Shop", "Basic POS", "Sales Reports", "Email Support"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29,000",
    period: "Ks / month",
    features: [
      "Unlimited Shops",
      "Full POS + Inventory",
      "Cloud Sync",
      "Priority Support",
      "Custom Reports",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored for you",
    features: [
      "White Label",
      "API Access",
      "Dedicated Server",
      "24/7 Support",
      "On-premise Option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const stats = [
  { value: "1,500+", label: "Active Shops", icon: <Layers className="w-5 h-5" /> },
  { value: "99.9%", label: "Uptime", icon: <Zap className="w-5 h-5" /> },
  { value: "24/7", label: "Support", icon: <Sparkles className="w-5 h-5" /> },
  { value: "<2s", label: "Load Time", icon: <Monitor className="w-5 h-5" /> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const w = window as unknown as Record<string, unknown>;
    setIsDesktop(
      ua.includes("electron") ||
      ua.includes("aioms-desktop") ||
      !!w.electron ||
      !!w.__TAURI__
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]"
        />
      </div>

      {/* Hero — Zoom-In on scroll */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Logo Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ ...spring, delay: 0.05 }}
            className="mb-6"
          >
            <img src="/aioms-logo.svg" alt="AIOMS" className="w-20 h-20 mx-auto rounded-2xl shadow-2xl shadow-blue-600/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-sm text-blue-300">
              AIOMS v2.0 — Next-Gen POS Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ ...spring, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight"
          >
            <span className="block leading-[1.1]">AIOMS</span>
            <span className="block leading-[1.6] py-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              အဆင့်မြင့် ဖုန်းဆိုင်သုံး
            </span>
            <span className="block leading-[1.2] mt-1">PC & Cloud POS စနစ်</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ ...spring, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            ဖုန်းဆိုင်လုပ်ငန်းများအတွက် Windows PC Application နှင့် Cloud Web
            Portal တစ်ခုတည်းတွင် အရောင်း၊ ပြင်ဆင်ရေး၊ စတော့၊ ဝန်ထမ်း
            စီမံခန့်ခွဲပါ။
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ ...spring, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isDesktop ? (
              <>
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.04, y: -6, boxShadow: "0px 20px 40px rgba(59, 130, 246, 0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
                >
                  🔑 အကောင့်ဝင်ရန် (Login to POS)
                </motion.a>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/80 text-base font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  📊 Dashboard သို့ သွားရန်
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </>
            ) : (
              <>
                <motion.a
                  href="/download"
                  whileHover={{ scale: 1.04, y: -6, boxShadow: "0px 20px 40px rgba(59, 130, 246, 0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
                >
                  <Download className="w-5 h-5" />
                  Download Windows PC App (.exe)
                </motion.a>
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/80 text-base font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <Globe className="w-5 h-5" />
                  Web Portal သို့ ဝင်ရန်
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar — stagger + scale on scroll */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={zoomIn}
                whileHover={{ scale: 1.06, y: -4 }}
                className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 text-center backdrop-blur-sm hover:border-blue-500/30 transition-colors duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 mb-3 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Showcase — scale zoom on scroll */}
      <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300">Interactive Demo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ဆော့ဖ်ဝဲလ် လုပ်ဆောင်ချက် နမူနာ မြင်ကွင်းများ
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Desktop PC Application မှ ရရှိနိုင်သည့် အဓိ Screen များ
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {tabContent.map((tab) => (
              <motion.button
                key={tab.id}
                variants={cardReveal}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:text-white hover:border-slate-600"
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto"
          >
            <div className="bg-slate-800/60 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-slate-400 ml-2 font-medium">
                {tabContent.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-sm font-bold text-white mb-4">
                    {tabContent.find((t) => t.id === activeTab)?.title}
                  </h3>
                  {tabContent.find((t) => t.id === activeTab)?.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features — stagger cascade + levitation hover */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Core Software Features
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              ဖုန်းဆိုင်လုပ်ငန်း လိုအပ်ချက် အားလုံးအတွက် တစ်နေရာတည်း
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={cardReveal}
                whileHover={{
                  scale: 1.04,
                  y: -6,
                  boxShadow: "0px 20px 40px rgba(59, 130, 246, 0.25)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 transition-colors shadow-lg hover:shadow-blue-500/10 cursor-default group"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-600/20 transition-colors"
                >
                  {f.icon}
                </motion.div>
                <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing — stagger + zoom + levitation */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">Flexible Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Pricing Plans
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              သင့်လိုအပ်ချက်နှင့် ကိုက်ညီသည့် Plan ကို ရွေးချယ်ပါ
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                variants={cardReveal}
                whileHover={{
                  scale: 1.04,
                  y: -8,
                  boxShadow: "0px 25px 50px rgba(59, 130, 246, 0.2)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative rounded-2xl p-8 border transition-colors ${
                  plan.highlighted
                    ? "bg-slate-900 border-blue-500/50 shadow-2xl shadow-blue-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                {plan.highlighted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={spring}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-600/30"
                  >
                    Most Popular
                  </motion.div>
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && plan.price !== "Free" && (
                    <span className="text-sm text-slate-400 ml-1">
                      {plan.period}
                    </span>
                  )}
                  {plan.price === "Free" && (
                    <span className="text-sm text-slate-400 ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: j * 0.05 }}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {feat}
                    </motion.li>
                  ))}
                </ul>
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.04, y: -4, boxShadow: "0px 15px 30px rgba(59, 130, 246, 0.2)" }}
                  whileTap={{ scale: 0.96 }}
                  className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Download CTA — zoom + floating glow */}
      {!isDesktop && (
        <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={spring}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px]"
              />
              <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-[80px]"
              />
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Monitor className="w-14 h-14 text-blue-400 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Windows PC App Download
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Windows 10/11 ပေါ်တွင် တိုက်ရိုက် install လုပ်နိုင်သည့်
                  Desktop Application
                </p>
                <motion.a
                  href="/download"
                  whileHover={{ scale: 1.04, y: -6, boxShadow: "0px 20px 40px rgba(59, 130, 246, 0.25)" }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
                >
                  <Download className="w-5 h-5" />
                  Download AIOMS Setup (.exe)
                </motion.a>
                <p className="text-xs text-slate-500 mt-4">
                  Windows 10/11 • 64-bit • 45 MB • Free Trial 30 Days
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Bar — convergence left+right */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-center sm:text-left"
            >
              <h3 className="text-lg font-bold text-white">
                📞 Contact Admin
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                မေးခွန်းများရှိပါက ဆက်သွယ်ပါ
              </p>
            </motion.div>
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.a
                href="https://t.me/LordPainReborn"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -4, boxShadow: "0px 12px 24px rgba(56, 189, 248, 0.15)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sm font-medium text-sky-300 hover:bg-sky-500/20 transition"
              >
                <Send className="w-4 h-4" />
                Telegram: @LordPainReborn
              </motion.a>
              <motion.a
                href="tel:+959961089869"
                whileHover={{ scale: 1.04, y: -4, boxShadow: "0px 12px 24px rgba(52, 211, 153, 0.15)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
              >
                <Phone className="w-4 h-4" />
                +959 961 089 869
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <img src="/aioms-logo.svg" alt="AIOMS" className="w-8 h-8 rounded-lg" />
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
        </motion.div>
      </footer>
    </div>
  );
}
