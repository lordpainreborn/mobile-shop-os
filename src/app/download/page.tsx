"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Globe,
  ArrowRight,
  Cpu,
  HardDrive,
  MemoryStick,
  Shield,
  Zap,
  Cloud,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Download,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 80, damping: 15 };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.75, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 15 },
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

const steps = [
  {
    num: "1",
    title: "Download Setup File",
    titleMy: "Setup File ကို Download လုပ်ပါ",
    desc: 'Click a download mirror button below to save "AIOMS_Setup.exe" to your computer.',
    descMy: 'အောက်ရှိ Download ခလုတ်ကို နှိပ်၍ "AIOMS_Setup.exe" ကို သင့်ကွန်ပျူတာထဲသို့ သိမ်းပါ။',
  },
  {
    num: "2",
    title: "Run Installer",
    titleMy: "Installer ကို Run ပါ",
    desc: "Double-click the downloaded .exe file and follow the installation wizard.",
    descMy: "Download ရထားသည့် .exe file ကို Double-click နှိပ်၍ Installation Wizard အတိုင်း လုပ်ဆောင်ပါ။",
  },
  {
    num: "3",
    title: "Launch & Login",
    titleMy: "ဖွင့်၍ Login ဝင်ပါ",
    desc: "Open AIOMS from your desktop or Start Menu, then log in with your credentials.",
    descMy: "Desktop သို့မဟုတ် Start Menu မှ AIOMS ကို ဖွင့်၍ သင့်အကောင့်ဖြင့် Login ဝင်ပါ။",
  },
];

const requirements = [
  { icon: <Cpu className="w-5 h-5" />, label: "OS", value: "Windows 10 / 11 (64-bit)" },
  { icon: <MemoryStick className="w-5 h-5" />, label: "RAM", value: "4 GB minimum" },
  { icon: <HardDrive className="w-5 h-5" />, label: "Storage", value: "200 MB free space" },
  { icon: <Shield className="w-5 h-5" />, label: "Network", value: "Internet for cloud sync" },
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]"
        />
      </div>

      {/* Hero — Zoom-In */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8"
          >
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Windows PC Application</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ ...spring, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]"
          >
            AIOMS Windows PC Application
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Official Download Center
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ ...spring, delay: 0.2 }}
            className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            ဖုန်းဆိုင်လုပ်ငန်းများအတွက် Windows PC Application ကို
            download mirror နှစ်ခုမှ ရယူနိုင်ပါပြီ။
          </motion.p>
        </div>
      </section>

      {/* Download Mirror Cards — LEFT/RIGHT Convergence */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Mirror 1 — Google Drive (slides from LEFT) */}
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.25 }}
              whileHover={{
                scale: 1.04,
                y: -8,
                boxShadow: "0px 25px 50px rgba(59, 130, 246, 0.2)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 transition-colors shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider">
                Fast Server
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Cloud className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Google Drive</h3>
                  <p className="text-xs text-slate-400">Reliable high-speed mirror</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {[
                  "v2.0 Setup — 64 Bit",
                  "Windows 10 / 11 Compatible",
                  "~45 MB • Free Trial 30 Days",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {text}
                  </motion.div>
                ))}
              </div>
              <motion.a
                href="https://drive.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 text-sm font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30"
              >
                🚀 Download via Google Drive
                <ExternalLink className="w-4 h-4 opacity-60" />
              </motion.a>
            </motion.div>

            {/* Mirror 2 — MediaFire (slides from RIGHT) */}
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.25 }}
              whileHover={{
                scale: 1.04,
                y: -8,
                boxShadow: "0px 25px 50px rgba(245, 158, 11, 0.15)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-8 transition-colors shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/30"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 uppercase tracking-wider">
                Direct Server
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">MediaFire</h3>
                  <p className="text-xs text-slate-400">Alternative fast direct mirror</p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {[
                  "v2.0 Setup — 64 Bit",
                  "Windows 10 / 11 Compatible",
                  "~45 MB • Free Trial 30 Days",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {text}
                  </motion.div>
                ))}
              </div>
              <motion.a
                href="https://mediafire.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-amber-500 text-sm font-bold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30"
              >
                ⚡ Download via MediaFire
                <ExternalLink className="w-4 h-4 opacity-60" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Installation Steps — stagger cascade */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold text-blue-300">Step by Step</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Installation Guide
            </h2>
            <p className="block text-base font-normal text-slate-400 mt-2">
              install လုပ်နည်း အဆင့်ဆင့်
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={cardReveal}
                whileHover={{
                  scale: 1.04,
                  y: -6,
                  boxShadow: "0px 20px 40px rgba(59, 130, 246, 0.15)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center transition-colors hover:border-blue-500/30"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/15 text-blue-400 text-sm font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs font-medium text-blue-400 mb-2">{step.titleMy}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.descMy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* System Requirements — stagger + levitation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">Requirements</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              System Requirements
            </h2>
            <p className="block text-base font-normal text-slate-400 mt-2">
              ကွန်ပျူတာ လိုအပ်ချက်များ
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {requirements.map((req) => (
              <motion.div
                key={req.label}
                variants={cardReveal}
                whileHover={{
                  scale: 1.06,
                  y: -4,
                  boxShadow: "0px 12px 24px rgba(59, 130, 246, 0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center transition-colors hover:border-blue-500/30"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 text-blue-400 mb-3">
                  {req.icon}
                </div>
                <p className="text-xs text-slate-500 mb-0.5">{req.label}</p>
                <p className="text-xs font-semibold text-slate-200">{req.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Login CTA — zoom */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600/15 rounded-full blur-[60px]"
            />
            <div className="relative z-10">
              <Globe className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Already have an account?
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                အကောင့်ရှိပြီးသားဆိုလျှင် Web Portal မှ Login ဝင်နိုင်ပါပြီ။
              </p>
              <motion.a
                href="/login"
                whileHover={{ scale: 1.04, y: -4, boxShadow: "0px 15px 30px rgba(59, 130, 246, 0.2)" }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-sm font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
              >
                🌐 Web Portal သို့ အကောင့်ဝင်ရန်
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
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
          <div className="flex items-center gap-2.5">
            <img src="/aioms-logo.svg?v=3" alt="AIOMS" className="w-7 h-7 rounded-md" />
            <span className="font-bold text-sm">AIOMS POS</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AIOMS. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="/" className="hover:text-white transition">
              Home
            </a>
            <a href="/login" className="hover:text-white transition">
              Login
            </a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
