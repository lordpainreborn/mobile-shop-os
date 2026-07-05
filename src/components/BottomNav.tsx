"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Package, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { nameEn: "Home", nameMy: "ပင်မ", href: "/dashboard", icon: Home },
  { nameEn: "POS", nameMy: "အရောင်း", href: "/sales", icon: ShoppingCart },
  { nameEn: "Stock", nameMy: "စတော့", href: "/products", icon: Package },
  { nameEn: "Account", nameMy: "အကောင့်", href: "/account", icon: User },
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
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
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
