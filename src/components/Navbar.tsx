"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Download", href: "/download" },
  { label: "Supported Features", href: "/#features" },
  { label: "Active License / Pricing", href: "/#pricing" },
  { label: "Reset Password", href: "/forgot-password" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-6 flex items-center justify-between"
    >
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
      <div className="hidden lg:flex items-center gap-6">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
          return (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                isActive ? "text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      {/* Right — Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/login"
          className="px-4 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition"
        >
          Log in
        </a>
        <a
          href="/signup"
          className="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md hover:scale-105 transition"
        >
          Register
        </a>
      </div>
    </motion.nav>
  );
}
