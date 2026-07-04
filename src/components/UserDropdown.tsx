"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User, Shield, LogOut, KeyRound, Monitor, Gem, Loader2 } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
};

interface UserDropdownProps {
  user: UserData;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const displayName = user.name || user.email.split("@")[0];
  const isDesktop = typeof navigator !== "undefined" &&
    (navigator.userAgent.toLowerCase().includes("electron") || navigator.userAgent.toLowerCase().includes("aioms-desktop"));

  function handleLogout() {
    setLoggingOut(true);
    router.push("/");
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setTimeout(() => router.refresh(), 100);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 hover:border-slate-600 px-3 py-1.5 rounded-full cursor-pointer transition shadow-md group"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
          {initials}
        </div>
        <div className="hidden md:flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-medium text-slate-200 truncate max-w-[100px]">{displayName}</span>
          <span className="text-[10px]" title="Active">🟢</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 text-slate-200 overflow-hidden">
            {/* User Summary */}
            <div className="px-4 py-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <Shield className="h-2.5 w-2.5" />
                      {user.role}
                    </span>
                    {user.shopId && (
                      <span className="text-[10px] text-slate-500 font-mono">Shop: {user.shopId.slice(0, 8)}...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="py-1 border-b border-slate-800/80">
              <button
                onClick={() => { setOpen(false); router.push("/dashboard"); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
              >
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                Account Details
              </button>
              <button
                onClick={() => { setOpen(false); router.push("/settings/password"); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
              >
                <KeyRound className="h-4 w-4 text-slate-500 shrink-0" />
                Change Password
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition text-left cursor-default"
              >
                <Monitor className="h-4 w-4 text-slate-500 shrink-0" />
                <span>{isDesktop ? "Windows PC (.exe) Client Active" : "Chrome Web Browser"}</span>
              </button>
            </div>

            {/* License */}
            <div className="py-1 border-b border-slate-800/80">
              <button
                onClick={() => { setOpen(false); router.push("/dashboard"); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
              >
                <Gem className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-medium">🟢 14 Days Remaining</span>
                </span>
              </button>
            </div>

            {/* Logout */}
            <div className="py-1">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition text-left mx-0"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <LogOut className="h-4 w-4 shrink-0" />
                )}
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
