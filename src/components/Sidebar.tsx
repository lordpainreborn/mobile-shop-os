"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, X, Settings, CreditCard, Download } from "lucide-react";
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
    { nameEn: "Account", nameMy: "အကောင့်", href: "/account", icon: Settings },
    { nameEn: "Subscription", nameMy: "စာရင်းသွင်းမှု", href: "/account#subscription", icon: CreditCard },
    { nameEn: "Download EXE", nameMy: "EXE ဒေါင်းလုဒ်", href: "/download", icon: Download },
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
          <h2 className="text-2xl font-extrabold text-blue-400 tracking-wider">AIOMS</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            {language === "en" ? "Account Portal" : "အကောင့် စီမံခန့်ခွဲမှု"}
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
