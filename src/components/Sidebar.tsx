"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Smartphone, Wrench, Receipt, LogOut, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const navItems = [
    { nameEn: 'Dashboard', nameMy: 'ပင်မစာမျက်နှာ', href: '/', icon: Home },
    { nameEn: 'Products', nameMy: 'ကုန်ပစ္စည်းများ', href: '/products', icon: Smartphone },
    { nameEn: 'Repairs', nameMy: 'ပြုပြင်ရေးလုပ်ငန်း', href: '/repairs', icon: Wrench },
    { nameEn: 'POS / Sales', nameMy: 'အရောင်းစနစ် (POS)', href: '/sales', icon: Receipt },
    { nameEn: 'Staff', nameMy: 'ဝန်ထမ်းများ', href: '/staff', icon: Users },
  ];

  return (
    <div
      className={`w-64 bg-[#0f172a] text-white h-screen p-5 fixed flex flex-col shadow-2xl z-20 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-400 tracking-wider">Shop OS</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            {language === 'en' ? 'Management' : 'စီမံခန့်ခွဲမှုစနစ်'}
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
          const label = language === 'en' ? item.nameEn : item.nameMy;
          return (
            <li key={item.nameEn}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                <span className="font-medium text-sm">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-slate-800 pt-4 pb-2">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-lg shadow-lg">
            H
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Hassan</p>
            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Super Admin' : 'ပင်မစီမံသူ'}
            </p>
          </div>
          <button className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
