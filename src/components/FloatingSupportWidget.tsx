"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  ChevronRight,
  Send,
  Phone,
  BookOpen,
  Headphones,
  ExternalLink,
  ArrowLeft,
  Shield,
  Download,
  CreditCard,
  HelpCircle,
} from "lucide-react";

type TabId = "faq" | "contact";
type TutorialId = "account" | "subscription" | "download" | null;

type TutorialCategory = {
  id: Exclude<TutorialId, null>;
  titleMy: string;
  titleEn: string;
  icon: React.ReactNode;
  steps: { my: string; en: string }[];
};

const TUTORIALS: TutorialCategory[] = [
  {
    id: "account",
    titleMy: "🔐 အကောင့်ဖွင့်နည်းနှင့် အကောင့်ဝင်နည်း",
    titleEn: "Account Registration & Login",
    icon: <Shield className="h-4 w-4" />,
    steps: [
      { my: "အကောင့်မရှိသေးပါက Sign Up page တွင် အီးမေးလ်ဖြင့် မှတ်ပုံတင်ပါ။", en: "If you don't have an account, register with your email on the Sign Up page." },
      { my: "OTP ကုဒ်ကို သင့်အီးမေးလ်သို့ ပို့ပေးပါမည်။", en: "An OTP code will be sent to your email." },
      { my: "OTP ကုဒ်ကိုထည့်၍ အကောင့်အတည်ပြုပါ။", en: "Enter the OTP code to verify your account." },
      { my: "အကောင့်ဝင်ရန် Login page တွင် အီးမေးလ်နှင့် စကားဝှက်ထည့်ပါ။", en: "Go to the Login page and enter your email and password to sign in." },
    ],
  },
  {
    id: "subscription",
    titleMy: "💳 လစဉ်ကြေးဝယ်ယူခြင်းနှင့် Token သုံးနည်း",
    titleEn: "Subscription & Token Redemption",
    icon: <CreditCard className="h-4 w-4" />,
    steps: [
      { my: "Token ကုဒ်များကို Telegram Bot မှတစ်ဆင့် ဝယ်ယူနိုင်ပါသည်။", en: "Purchase token codes via our Telegram bot." },
      { my: "သင့် Account page တွင် 'Redeem Token' ကဏ္ဍသို့သွားပါ။", en: "Go to the 'Redeem Token' section on your Account page." },
      { my: "Token ကုဒ်ကိုထည့်၍ Redeem ခလုတ်ကိုနှိပ်ပါ။", en: "Enter the token code and click Redeem." },
      { my: "သင့် subscription သက်တမ်းသည် token ၏ duration_days အတိုင်း တိုးမြှင့်သွားပါမည်။", en: "Your subscription expiry will be extended by the token's duration." },
    ],
  },
  {
    id: "download",
    titleMy: "⬇️ AIOMS EXE ဒေါင်းလုဒ်နှင့် အသုံးပြုနည်း",
    titleEn: "Download & Use the EXE",
    icon: <Download className="h-4 w-4" />,
    steps: [
      { my: "Download page မှ AIOMS EXE ကိုဒေါင်းလုဒ်လုပ်ပါ။", en: "Download the AIOMS EXE from the Download page." },
      { my: "EXE ဖိုင်ကိုဖွင့်၍ သင်၏အကောင့်အီးမေးလ်နှင့် စကားဝှက်ဖြင့်ဝင်ပါ။", en: "Open the EXE and log in with your account email and password." },
      { my: "သင်၏ subscription သက်တမ်းကို စစ်ဆေးနိုင်ပြီး POS လုပ်ဆောင်ချက်အားလုံးကို အသုံးပြုနိုင်ပါသည်။", en: "Your subscription status will sync, and you can access all POS features." },
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
    <div ref={panelRef} className="fixed bottom-20 left-4 z-50 flex flex-col items-start gap-3 lg:bottom-4">
      {open && (
        <div className="w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100">
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
                  <p className="text-[11px] text-slate-500 font-medium px-1 mb-2">
                    Portal Guides / လမ်းညွှန်ချက်များ
                  </p>
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
                  <div className="mt-3 rounded-xl border border-slate-700 bg-slate-800/30 p-3">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      POS features (Sales, Inventory, Repairs, Reports) are available only in the Desktop EXE application.
                      This web portal is for account and billing management only.
                    </p>
                    <a
                      href="/download"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-500 transition"
                    >
                      <Download className="h-3 w-3" />
                      Download EXE
                    </a>
                  </div>
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
