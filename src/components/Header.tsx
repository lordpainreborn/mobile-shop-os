"use client";
import { Bell, Search, UserCircle, Globe, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-sm gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center bg-slate-100 px-4 py-2 rounded-full flex-1 max-w-md focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={18} className="text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search products, tickets, or IMEI...' : 'ပစ္စည်းများ၊ ပြင်ဆင်မှုများ ရှာဖွေရန်...'}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400 min-w-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all border border-slate-200 cursor-pointer"
        >
          <Globe size={16} className="text-blue-600 shrink-0" />
          <span className="hidden sm:inline">{language === 'en' ? 'English' : 'မြန်မာ'}</span>
        </button>

        <button className="relative text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>
        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
          <UserCircle size={28} className="text-slate-600" />
          <div className="text-sm hidden md:block">
            <p className="font-semibold text-slate-700 leading-tight">Hassan</p>
          </div>
        </div>
      </div>
    </header>
  );
}
