"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Loader2 } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
};

const PUBLIC_PATHS = ["/", "/download", "/login", "/signup", "/forgot-password", "/reset-password", "/terms-of-service", "/privacy-policy"];

function isDesktopEnv() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const w = window as unknown as Record<string, unknown>;
  return (
    ua.includes("electron") ||
    ua.includes("aioms-desktop") ||
    !!w.electron ||
    !!w.__TAURI__ ||
    !!w.__ELECTRON__
  );
}

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p)));

  useEffect(() => {
    setDesktop(isDesktopEnv());
  }, []);

  useEffect(() => {
    if (isPublic) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [isPublic, router, pathname]);

  if (isPublic) {
    return (
      <>
        {!desktop && <Navbar />}
        {children}
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user?.role}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen pb-16 lg:pb-0">
        <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
      <BottomNav />
    </>
  );
}
