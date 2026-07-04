"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  ChevronDown,
  ChevronRight,
  Send,
  Phone,
  BookOpen,
  Headphones,
  ExternalLink,
  ArrowLeft,
  Package,
  Wrench,
  ShoppingCart,
  Shield,
} from "lucide-react";

type TabId = "faq" | "contact";
type TutorialId = "products" | "repairs" | "pos" | "system" | null;

type TutorialCategory = {
  id: Exclude<TutorialId, null>;
  titleMy: string;
  titleEn: string;
  icon: React.ReactNode;
  steps: { my: string; en: string }[];
};

const TUTORIALS: TutorialCategory[] = [
  {
    id: "products",
    titleMy: "📦 ပစ္စည်းစာရင်း ထည့်သွင်းနည်း",
    titleEn: "Inventory Guide",
    icon: <Package className="h-4 w-4" />,
    steps: [
      { my: "Sidebar မှ Products page ကို သွားပါ။", en: "Navigate to the Products page from the sidebar menu." },
      { my: '"Add Product" ခလုတ်ကို နှိပ်ပါ။', en: 'Click the "Add Product" button at the top of the page.' },
      { my: "ပစ္စည်းအမည်၊ အမျိုးအစား၊ အရင်းအနှီး၊ ရောင်းစျေးနှင့် အရေအတွက်ကို ဖြည့်ပါ။", en: "Fill in product name, category, cost, selling price, and stock quantity." },
      { my: '"Save" ကို နှိပ်၍ inventory ထဲ ထည့်ပါ။', en: 'Click "Save" to add the product to your live inventory.' },
      { my: "Edit နှင့် Delete ခလုတ်များဖြင့် စီမံပါ။", en: "Use Edit and Delete buttons on each product row to manage records." },
    ],
  },
  {
    id: "repairs",
    titleMy: "🛠️ ပြုပြင်ရေး လက်ခံစာရင်း ဖွင့်နည်း",
    titleEn: "Repair Tickets Guide",
    icon: <Wrench className="h-4 w-4" />,
    steps: [
      { my: "Sidebar မှ Repairs page ကို သွားပါ။", en: "Navigate to the Repairs page from the sidebar." },
      { my: '"New Ticket" ခလုတ်ကို နှိပ်ပါ။', en: 'Click "New Ticket" to create a repair entry.' },
      { my: "ဖောက်သည့်အမည်၊ ဖုန်းနံပါတ်၊ Device Model၊ ပြဿနာဖော်ပြချက်နှင့် ခန့်မှန်းကုန်ကျငွေကို ထည့်ပါ။", en: "Enter customer name, phone, device model, issue description, and estimated cost." },
      { my: '"Save" ကို နှိပ်၍ ticket ဖွင့်ပါ။', en: 'Click "Save" to create the repair ticket.' },
      { my: "Status ကို update လုပ်ပါ။ PENDING → CHECKING → REPAIRING → READY → DELIVERED", en: "Update status: PENDING > CHECKING > REPAIRING > READY > DELIVERED." },
      { my: "Technician ကို assign လုပ်၍ progress note ရေးပါ။", en: "Assign a Technician to the ticket and update progress notes." },
    ],
  },
  {
    id: "pos",
    titleMy: "🛒 POS အရောင်းဘောက်ချာ ဖြတ်နည်း",
    titleEn: "POS Checkout Guide",
    icon: <ShoppingCart className="h-4 w-4" />,
    steps: [
      { my: "Sidebar မှ Sales (POS) page ကို သွားပါ။", en: "Navigate to the Sales (POS) page from the sidebar." },
      { my: "Barcode စကင်ဖတ်ပါ သို့မဟုတ် ပစ္စည်းအမည်ဖြင့် ရှာပါ။", en: "Scan a barcode or search by product name to find items." },
      { my: "ပစ္စည်းများကို cart ထဲ ထည့်၍ အရေအတွက် ညှိပါ။", en: "Add products to the cart and adjust quantities as needed." },
      { my: "Payment Method ရွေးပါ။ Cash / KBZ Pay / Wave Money စသည်။", en: "Select a payment method (Cash, KBZ Pay, Wave Money, etc.)." },
      { my: '"Checkout" ခလုတ်ကို နှိပ်၍ အရောင်းစာရင်း မှတ်ပါ။', en: 'Click "Checkout" to record the sale. Stock will update automatically.' },
    ],
  },
  {
    id: "system",
    titleMy: "🔐 အကောင့်နှင့် လစဉ်ကြေး ဝန်ဆောင်မှု",
    titleEn: "Account & Subscription",
    icon: <Shield className="h-4 w-4" />,
    steps: [
      { my: "Login Page တွင် Email နှင့် Password ထည့်၍ Log In ခလုတ်ကို နှိပ်ပါ။", en: "Enter your email and password on the Login page, then click Log In." },
      { my: "Admin များသည် Staff page ရှိ User Management ဖြင့် ဝန်ထမ်းအကောင့်များကို စီမံနိုင်ပါသည်။", en: "Admins can manage staff accounts via User Management in the Staff page." },
      { my: "Roles သုံးမျိုးရှိပါသည်။ ADMIN၊ TECHNICIAN၊ CASHIER။", en: "Three roles: ADMIN (full access), TECHNICIAN (repairs), CASHIER (POS)." },
      { my: "Dashboard တွင် အရောင်းစုစုပေါင်း၊ repair status နှင့် ပစ္စည်းအကျဉ်းချုပ်ကို မြင်ရပါသည်။", en: "The Dashboard shows sales totals, repair status, and product overview." },
    ],
  },
];

const CONTACTS = [
  { label: "Telegram", value: "@LordPainReborn", url: "https://t.me/LordPainReborn", icon: <Send className="h-4 w-4" /> },
  { label: "Hotline / Viber", value: "+959 961 089 869", url: "tel:+959961089869", icon: <Phone className="h-4 w-4" /> },
];

export default function FloatingSupportWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("faq");
  const [expandedTutorial, setExpandedTutorial] = useState<TutorialId>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setExpandedTutorial(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
      {open && (
        <div className="w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">AIOMS Support Center</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  စနစ်အသုံးပြုနည်းနှင့် အကူအညီ ရယူရန်
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); setExpandedTutorial(null); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              type="button"
              onClick={() => setTab("faq")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition ${
                tab === "faq"
                  ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              System Assistant
            </button>
            <button
              type="button"
              onClick={() => setTab("contact")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition ${
                tab === "contact"
                  ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Headphones className="h-3.5 w-3.5" />
              Admin Contact
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[26rem] overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {tab === "faq" ? (
              expandedTutorial ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedTutorial(null)}
                    className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-slate-700"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Topics
                  </button>

                  <div className="mb-3">
                    <p className="text-sm font-bold text-white">
                      {TUTORIALS.find((t) => t.id === expandedTutorial)?.titleMy}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {TUTORIALS.find((t) => t.id === expandedTutorial)?.titleEn}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {TUTORIALS.find((t) => t.id === expandedTutorial)?.steps.map((step, i) => (
                      <div key={i} className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
                        <div className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] font-bold text-emerald-400">
                          {i + 1}
                        </div>
                        <p className="text-[13px] font-medium text-slate-100 leading-snug">{step.my}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">{step.en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {TUTORIALS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setExpandedTutorial(t.id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3 text-left transition hover:border-slate-700 hover:bg-slate-800/80 group"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 group-hover:bg-slate-700 transition">
                        {t.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold text-slate-100 truncate">{t.titleMy}</span>
                        <span className="block text-[11px] text-slate-400 truncate">{t.titleEn}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500 font-medium px-1 mb-1">
                  ဆက်သွယ်ရန် လမ်းကြောင်းများ
                </p>
                {CONTACTS.map((c) => (
                  <a
                    key={c.label}
                    href={c.url}
                    target={c.url.startsWith("http") ? "_blank" : undefined}
                    rel={c.url.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3 transition hover:border-emerald-500/30 hover:bg-slate-800/80 group"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/15 transition">
                      {c.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-slate-100">{c.label}</span>
                      <span className="block text-[11px] text-slate-400">{c.value}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-white shadow-2xl transition-all hover:bg-slate-800 hover:scale-105 group"
        aria-label="Open support widget"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <MessageCircle className="h-4 w-4 text-slate-300 group-hover:text-white transition" />
        <span className="hidden sm:inline">Help & Support</span>
      </button>
    </div>
  );
}
