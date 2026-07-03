"use client";
import React from 'react';
import { DollarSign, Smartphone, Wrench, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { language } = useLanguage();

  const texts = {
    title: language === 'en' ? 'Dashboard Overview' : 'လုပ်ငန်း အခြေအနေ အကျဉ်းချုပ်',
    subtitle: language === 'en' ? "Here is what's happening in your shop today." : 'ယနေ့ ဆိုင်တွင်း လုပ်ဆောင်ချက် အချက်အလက်များ',
    salesTitle: language === 'en' ? 'Total Sales (Today)' : 'ယနေ့ စုစုပေါင်း အရောင်း',
    salesTrend: language === 'en' ? '+12%' : '+၁၂%',
    repairsTitle: language === 'en' ? 'Active Repairs' : 'လက်ရှိ ပြင်ဆင်နေဆဲ ဖုန်းများ',
    repairsTrend: language === 'en' ? '3 pending' : '၃ လုံး ကျန်သေးသည်',
    soldTitle: language === 'en' ? 'Phones Sold' : 'ရောင်းရသည့် ဖုန်းအရေအတွက်',
    soldTrend: language === 'en' ? 'This week' : 'ယခုအပတ်အတွင်း',
    alertTitle: language === 'en' ? 'Low Stock Alert' : 'ပစ္စည်း ပြတ်လပ်မှု သတိပေးချက်',
    alertTrend: language === 'en' ? 'Needs restock' : 'အမြန် ဖြည့်တင်းရန်',
    activityTitle: language === 'en' ? 'Recent Activity' : 'လတ်တလော လုပ်ဆောင်ချက်များ',
    chartPlaceholder: language === 'en' ? 'Data visualization charts will go here...' : 'လုပ်ငန်းပြ ဇယားများ ဒီနေရာတွင် ပေါ်လာပါမည်...',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">{texts.title}</h1>
        <p className="text-slate-500 mt-1">{texts.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={texts.salesTitle} 
          value="125,000 Ks" 
          icon={<DollarSign size={24} className="text-emerald-600" />} 
          trend={texts.salesTrend} 
          color="bg-emerald-100" 
        />
        <StatCard 
          title={texts.repairsTitle} 
          value="14" 
          icon={<Wrench size={24} className="text-blue-600" />} 
          trend={texts.repairsTrend} 
          color="bg-blue-100" 
        />
        <StatCard 
          title={texts.soldTitle} 
          value="8" 
          icon={<Smartphone size={24} className="text-purple-600" />} 
          trend={texts.soldTrend} 
          color="bg-purple-100" 
        />
        <StatCard 
          title={texts.alertTitle} 
          value={language === 'en' ? "5 Items" : "၅ မျိုး"} 
          icon={<AlertCircle size={24} className="text-red-600" />} 
          trend={texts.alertTrend} 
          color="bg-red-100" 
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{texts.activityTitle}</h2>
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-slate-400 font-medium">{texts.chartPlaceholder}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">{trend}</span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-extrabold text-slate-800 mt-1">{value}</p>
    </div>
  );
}