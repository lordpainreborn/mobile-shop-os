"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Menu, LogOut, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabase } from "@/lib/supabase";

interface HeaderProps {
  onMenuClick?: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await getSupabase().auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const displayName = user?.name ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-sm gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Menu size={22} />
        </button>
        <a href="/" className="text-lg font-extrabold text-slate-800 tracking-tight">
          AIOMS <span className="text-blue-500">Portal</span>
        </a>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all border border-slate-200 cursor-pointer"
        >
          <Globe size={16} className="text-blue-600 shrink-0" />
          <span className="hidden sm:inline">{language === "en" ? "English" : "မြန်မာ"}</span>
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {initials}
            </div>
            <div className="text-sm hidden md:block text-left">
              <p className="font-semibold text-slate-700 leading-tight">{displayName}</p>
              {user?.role && (
                <p className="text-xs text-slate-400 leading-tight">{user.role}</p>
              )}
            </div>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-2 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                </div>
                <a
                  href="/account"
                  className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Account & Billing
                </a>
                <a
                  href="/download"
                  className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Download EXE
                </a>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  {loggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
