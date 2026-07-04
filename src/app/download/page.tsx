"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  Download,
  CheckCircle2,
  Globe,
  ArrowRight,
  Smartphone,
  Shield,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const steps = [
  {
    num: "1",
    title: "Download Setup File",
    titleMy: "Setup File ကို Download လုပ်ပါ",
    desc: 'Click the download button above to save "AIOMS_Setup.exe" to your computer.',
    descMy: 'အပေါ်ရှိ Download ခလုတ်ကို နှိပ်၍ "AIOMS_Setup.exe" ကို သင့်ကွန်ပျူတာထဲသို့ သိမ်းပါ။',
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
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/75 border-b border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">AIOMS</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold hover:bg-blue-500 transition"
            >
              Web Portal
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8"
          >
            <Monitor className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Windows PC Application</span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]"
          >
            AIOMS PC & Cloud POS
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Windows App Download Center
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            ဖုန်းဆိုင်လုပ်ငန်းများအတွက် Windows PC Application ကို
            တိုက်ရိုက် install လုပ်နိုင်ပါပြီ။
          </motion.p>

          {/* Download CTA */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col items-center gap-4"
          >
            <motion.a
              href="/downloads/AIOMS_Setup.exe"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 text-lg font-bold hover:bg-blue-500 transition shadow-2xl shadow-blue-600/30"
            >
              <Download className="w-6 h-6" />
              Download Windows Setup (.exe)
            </motion.a>
            <p className="text-xs text-slate-500">
              Windows 10/11 • 64-bit • ~45 MB • Free Trial 30 Days
            </p>
          </motion.div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-extrabold text-center mb-12"
          >
            Installation Guide
            <span className="block text-base font-normal text-slate-400 mt-2">
              install လုပ်နည်း အဆင့်ဆင့်
            </span>
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center"
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
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-extrabold text-center mb-10"
          >
            System Requirements
            <span className="block text-base font-normal text-slate-400 mt-2">
              ကွန်ပျူတာ လိုအပ်ချက်များ
            </span>
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {requirements.map((req, i) => (
              <motion.div
                key={req.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 text-blue-400 mb-3">
                  {req.icon}
                </div>
                <p className="text-xs text-slate-500 mb-0.5">{req.label}</p>
                <p className="text-xs font-semibold text-slate-200">{req.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl"
          >
            <Globe className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Already have an account?
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              အကောင့်ရှိပြီးသားဆိုလျှင် Web Portal မှ Login ဝင်နိုင်ပါပြီ။
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-sm font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
            >
              🌐 Web Portal သို့ အကောင့်ဝင်ရန်
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4 relative z-10">
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
            <a href="/" className="hover:text-white transition">
              Home
            </a>
            <a href="/login" className="hover:text-white transition">
              Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
