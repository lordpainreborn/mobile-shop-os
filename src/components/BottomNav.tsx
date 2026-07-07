"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Download, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { nameEn: "Account", nameMy: "အကောင့်", href: "/account", icon: Settings },
  { nameEn: "Subscription", nameMy: "စာရင်းသွင်းမှု", href: "/account#subscription", icon: CreditCard },
  { nameEn: "Download", nameMy: "ဒေါင်းလုဒ်", href: "/download", icon: Download },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();

  const publicPaths = ["/", "/download", "/login", "/signup", "/forgot-password", "/terms-of-service", "/privacy-policy"];
  if (publicPaths.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p)))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const label = language === "en" ? item.nameEn : item.nameMy;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
