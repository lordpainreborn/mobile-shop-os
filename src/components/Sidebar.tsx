"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Smartphone, Wrench, Receipt, Shield, X, Banknote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  userRole?: string;
}

export default function Sidebar({ open = false, onClose, userRole }: SidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const navItems = [
    { nameEn: "Dashboard", nameMy: "ပင်မစာမျက်နှာ", href: "/dashboard", icon: Home },
    { nameEn: "POS / Sales", nameMy: "အရောင်းကောင်တာ (POS)", href: "/sales", icon: Receipt },
    { nameEn: "Products", nameMy: "ကုန်ပစ္စည်း စာရင်း (Inventory)", href: "/products", icon: Smartphone },
    { nameEn: "Repairs", nameMy: "ပြုပြင်ရေး စာရင်း (Repairs)", href: "/repairs", icon: Wrench },
    { nameEn: "Expenses", nameMy: "အသုံးစရိတ် စာရင်း (Expenses)", href: "/expenses", icon: Banknote },
    { nameEn: "Staff", nameMy: "ဝန်ထမ်းနှင့် ဆိုင်ဆက်တင် (Settings)", href: "/staff", icon: Users },
  ];

  if (userRole === "SUPER_ADMIN") {
    navItems.push({
      nameEn: "Admin Panel",
      nameMy: "Admin Panel",
      href: "/admin",
      icon: Shield,
    });
  }

  return (
    <div
      className={`w-64 bg-[#0f172a] text-white h-screen p-5 fixed flex flex-col shadow-2xl z-20 transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-400 tracking-wider">AIOMS POS</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            {language === "en" ? "Cloud Platform" : "ဖုန်းဆိုင် စီမံခန့်ခွဲမှုစနစ်"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <ul className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const label = language === "en" ? item.nameEn : item.nameMy;
          return (
            <li key={item.nameEn}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "animate-pulse" : ""} />
                <span className="font-medium text-sm">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
