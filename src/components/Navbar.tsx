"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Sparkles, Gem, KeyRound } from "lucide-react";

const NAV_LINKS = [
  { label: "Download", labelMy: "📥 Download", href: "/download", icon: <Download className="w-3.5 h-3.5" /> },
  { label: "Supported Features", labelMy: "✨ Supported Features", href: "/#features", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: "Active License / Pricing", labelMy: "💎 Active License / Pricing", href: "/#pricing", icon: <Gem className="w-3.5 h-3.5" /> },
  { label: "Reset Password", labelMy: "🔑 Reset Password", href: "/forgot-password", icon: <KeyRound className="w-3.5 h-3.5" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left — Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="text-xl">🛡️</span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            AIOMS <span className="text-blue-400">POS</span>
          </span>
          <span className="ml-1 inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 leading-none">
            v2.0
          </span>
        </a>

        {/* Center — Nav Links (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {link.icon}
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right — Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg hover:shadow-amber-500/20 transition-all hover:scale-105"
          >
            🔑 Register
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
