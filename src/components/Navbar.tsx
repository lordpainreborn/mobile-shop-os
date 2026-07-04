"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import UserDropdown from "./UserDropdown";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
};

const NAV_LINKS = [
  { label: "Download", href: "/download" },
  { label: "Supported Features", href: "/#features" },
  { label: "Active License / Pricing", href: "/#pricing" },
  { label: "Reset Password", href: "/forgot-password" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
        setAuthLoaded(true);
      })
      .catch(() => setAuthLoaded(true));
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-6 flex items-center justify-between"
    >
      <a href="/" className="flex items-center gap-2.5 shrink-0">
        <img src="/aioms-logo.svg" alt="AIOMS" className="h-9 w-9 rounded-lg" />
        <span className="text-lg font-extrabold tracking-tight text-white hidden sm:inline">
          AIOMS <span className="text-blue-400">POS</span>
        </span>
        <span className="ml-1 hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 leading-none">
          v2.0
        </span>
      </a>

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

      <div className="flex items-center gap-3 shrink-0">
        {authLoaded && user ? (
          <UserDropdown user={user} />
        ) : authLoaded ? (
          <>
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
          </>
        ) : (
          <div className="w-[140px] h-8" />
        )}
      </div>
    </motion.nav>
  );
}
