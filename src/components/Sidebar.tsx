"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Smartphone, Wrench, Receipt, Shield, X } from "lucide-react";
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
    { nameEn: "Dashboard", nameMy: "\u{1000}\u{102B}\u{1015}\u{103A}\u{1019}\u{102C}\u{1038}\u{102A}\u{1031}\u{102C}\u{1037}", href: "/", icon: Home },
    { nameEn: "Products", nameMy: "\u{1000}\u{102B}\u{1015}\u{103A}\u{1019}\u{102C}\u{102C}\u{1021}\u{103A}\u{1038}\u{1039}\u{1038}\u{1032}\u{1021}\u{1031}\u{102C}", href: "/products", icon: Smartphone },
    { nameEn: "Repairs", nameMy: "\u{101F}\u{102F}\u{1019}\u{103A}\u{1014}\u{1031}\u{101C}\u{103A}\u{102E}\u{1031}\u{102C}\u{103A}\u{1010}\u{103A}\u{1026}\u{1031}\u{102C}", href: "/repairs", icon: Wrench },
    { nameEn: "POS / Sales", nameMy: "\u{1000}\u{1031}\u{102C}\u{103D}\u{1039}\u{1010}\u{103A}\u{1026} \u{102C}\u{1031}\u{1026}\u{1015}\u{103A}\u{1025}\u{1038}\u{1021}\u{103A}\u{1031}\u{102C}", href: "/sales", icon: Receipt },
    { nameEn: "Staff", nameMy: "\u{1019}\u{103B}\u{1019}\u{1014}\u{103A}\u{1019}\u{102C}\u{1021}\u{1031}\u{102C}", href: "/staff", icon: Users },
  ];

  if (userRole === "SUPER_ADMIN") {
    navItems.push({
      nameEn: "Admin Panel",
      nameMy: "\u{1021}\u{103B}\u{1025}\u{103A}\u{1038}\u{103A}\u{1021}\u{103A}\u{1019}\u{103A}\u{102C}\u{1031}\u{102C}\u{1026}\u{1015}\u{103B}\u{1014}\u{103A}\u{1025}\u{1038}\u{1021}\u{103A}\u{1031}\u{102C}",
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
          <h2 className="text-2xl font-extrabold text-blue-400 tracking-wider">Shop OS</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            {language === "en" ? "Cloud Platform" : "\u{1015}\u{103D}\u{102D}\u{1019}\u{103A}\u{1038}\u{1038}\u{1031}\u{102C}\u{1026}\u{1015}\u{103B}\u{1014}\u{103A}"}
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
