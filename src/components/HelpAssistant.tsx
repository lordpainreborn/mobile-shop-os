"use client";

import { useState } from "react";
import {
  MessageCircle,
  Phone,
  ArrowLeft,
  Package,
  Wrench,
  ShoppingCart,
  Shield,
} from "lucide-react";

type TutorialId = "products" | "repairs" | "pos" | "system";

type TutorialCategory = {
  id: TutorialId;
  titleMy: string;
  titleEn: string;
  icon: React.ReactNode;
  steps: { my: string; en: string }[];
};

const TUTORIALS: TutorialCategory[] = [
  {
    id: "products",
    titleMy: "📦 ပစ္စည်းစာရင်း ထည့်သွင်းနည်း (Inventory Guide)",
    titleEn: "Products Guide",
    icon: <Package className="h-5 w-5" />,
    steps: [
      {
        my: "Sidebar မှ Products page ကို သွားပါ။",
        en: "Navigate to the Products page from the sidebar menu.",
      },
      {
        my: '"Add Product" ခလုတ်ကို နှိပ်ပါ။',
        en: 'Click the "Add Product" button at the top of the page.',
      },
      {
        my: "ပစ္စည်းအမည်၊ အမျိုးအစား (PHONE / ACCESSORY / PART)၊ အရင်းအနှီး၊ ရောင်းစျေးနှင့် အရေအတွက်ကို ဖြည့်ပါ။",
        en: "Fill in product name, category (PHONE / ACCESSORY / PART), cost, selling price, and stock quantity.",
      },
      {
        my: '"Save" ကို နှိပ်၍ inventory ထဲ ထည့်ပါ။',
        en: 'Click "Save" to add the product to your live inventory.',
      },
      {
        my: "Edit နှင့် Delete ခလုတ်များဖြင့် စီမံပါ။",
        en: "Use Edit and Delete buttons on each product row to manage records.",
      },
    ],
  },
  {
    id: "repairs",
    titleMy: "🛠️ ပြုပြင်ရေး လက်ခံစာရင်း ဖွင့်နည်း (Repair Tickets Guide)",
    titleEn: "Repairs Guide",
    icon: <Wrench className="h-5 w-5" />,
    steps: [
      {
        my: "Sidebar မှ Repairs page ကို သွားပါ။",
        en: "Navigate to the Repairs page from the sidebar.",
      },
      {
        my: '"New Ticket" ခလုတ်ကို နှိပ်ပါ။',
        en: 'Click "New Ticket" to create a repair entry.',
      },
      {
        my: "ဖောက်သည့်အမည်၊ ဖုန်းနံပါတ်၊ Device Model၊ ပြဿနာဖော်ပြချက်နှင့် ခန့်မှန်းကုန်ကျငွေကို ထည့်ပါ။",
        en: "Enter customer name, phone, device model, issue description, and estimated cost.",
      },
      {
        my: '"Save" ကို နှိပ်၍ ticket ဖွင့်ပါ။',
        en: 'Click "Save" to create the repair ticket.',
      },
      {
        my: "Status ကို update လုပ်ပါ။ PENDING → CHECKING → REPAIRING → READY → DELIVERED",
        en: "Update status as work progresses: PENDING > CHECKING > REPAIRING > READY > DELIVERED.",
      },
      {
        my: "Technician ကို assign လုပ်၍ progress note ရေးပါ။",
        en: "Assign a Technician to the ticket and update progress notes.",
      },
    ],
  },
  {
    id: "pos",
    titleMy: "🛒 POS ကောင်တာ အရောင်းဘောက်ချာ ဖြတ်နည်း (POS Checkout Guide)",
    titleEn: "POS Checkout Guide",
    icon: <ShoppingCart className="h-5 w-5" />,
    steps: [
      {
        my: "Sidebar မှ Sales (POS) page ကို သွားပါ။",
        en: "Navigate to the Sales (POS) page from the sidebar.",
      },
      {
        my: "Barcode စကင်ဖတ်ပါ သို့မဟုတ် ပစ္စည်းအမည်ဖြင့် ရှာပါ။",
        en: "Scan a barcode or search by product name to find items.",
      },
      {
        my: "ပစ္စည်းများကို cart ထဲ ထည့်၍ အရေအတွက် ညှိပါ။",
        en: "Add products to the cart and adjust quantities as needed.",
      },
      {
        my: "Payment Method ရွေးပါ။ Cash / KBZ Pay / Wave Money စသည်။",
        en: "Select a payment method (Cash, KBZ Pay, Wave Money, etc.).",
      },
      {
        my: '"Checkout" ခလုတ်ကို နှိပ်၍ အရောင်းစာရင်း မှတ်ပါ။ Stock ကို အလိုအလျောက် update လုပ်ပါမည်။',
        en: 'Click "Checkout" to record the sale. Stock will update automatically.',
      },
    ],
  },
  {
    id: "system",
    titleMy: "🔐 အကောင့်နှင့် လစဉ်ကြေး ဝန်ဆောင်မှု (Account & Subscription)",
    titleEn: "System & Account Guide",
    icon: <Shield className="h-5 w-5" />,
    steps: [
      {
        my: "Login Page တွင် Email နှင့် Password ထည့်၍ Log In ခလုတ်ကို နှိပ်ပါ။",
        en: "Enter your email and password on the Login page, then click Log In.",
      },
      {
        my: "Admin များသည် Staff page ရှိ User Management ဖြင့် ဝန်ထမ်းအကောင့်များကို စီမံနိုင်ပါသည်။",
        en: "Admins can manage staff accounts via User Management in the Staff page.",
      },
      {
        my: "Roles သုံးမျိုးရှိပါသည်။ ADMIN (အကုန်)၊ TECHNICIAN (ပြုပြင်ရေး)၊ CASHIER (POS)။",
        en: "Three roles available: ADMIN (full access), TECHNICIAN (repairs), CASHIER (POS).",
      },
      {
        my: "Dashboard တွင် အရောင်းစုစုပေါင်း၊ repair status နှင့် ပစ္စည်းအကျဉ်းချုပ်ကို မြင်ရပါသည်။",
        en: "The Dashboard shows sales totals, repair status, and product overview.",
      },
      {
        my: "Password reset သို့မဟုတ် access ပြဿနာအတွက် Contact Admin ခလုတ်ကို နှိပ်ပါ။",
        en: "For password resets or access issues, use the Contact Admin button below.",
      },
    ],
  },
];

const ADMIN_CONTACTS = [
  { label: "Telegram", value: "@LordPainReborn", url: "https://t.me/LordPainReborn" },
  { label: "Phone", value: "+959961089869", url: "tel:+959961089869" },
  { label: "Viber", value: "+959798293948", url: "viber://chat?number=%2B959798293948" },
  { label: "Facebook", value: "Bhone Myat Paing", url: "https://www.facebook.com/BhoneMyatPaing" },
];

export default function HelpAssistant() {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<TutorialId | null>(null);

  const selectedTutorial = TUTORIALS.find((t) => t.id === activeTutorial);

  return (
    <>
      {/* ── Chat / Help Widget — Bottom-Right ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="w-[380px] max-w-[90vw] rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between px-2 py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  👋 မင်္ဂလာပါ! AIOMS Cloud POS စနစ်မှ ကြိုဆိုပါတယ်။
                </p>
                <p className="text-xs text-slate-500">English / Myanmar</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mb-3 max-h-[28rem] overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-3">
              {selectedTutorial ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveTutorial(null)}
                    className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Topics
                  </button>

                  <div className="mb-3">
                    <p className="text-sm font-bold text-slate-900">
                      {selectedTutorial.titleMy}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedTutorial.titleEn}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedTutorial.steps.map((step, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                      >
                        <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {step.my}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {step.en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="mb-2 px-1 text-xs font-medium text-slate-500">
                    Select a topic:
                  </p>
                  {TUTORIALS.map((tutorial) => (
                    <button
                      key={tutorial.id}
                      type="button"
                      onClick={() => setActiveTutorial(tutorial.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {tutorial.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-900 truncate">
                          {tutorial.titleMy}
                        </span>
                        <span className="block text-xs text-slate-500 truncate">
                          {tutorial.titleEn}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setOpen((c) => !c);
            setAdminOpen(false);
          }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl transition hover:bg-slate-800"
          aria-label="Open tutorials and help"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* ── Contact Admin — Bottom-Left ── */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
        {adminOpen && (
          <div className="w-[300px] max-w-[90vw] rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-900">
                Contact Admin
              </p>
              <p className="text-xs text-slate-600">
                Need urgent help? Reach out via any channel.
              </p>
            </div>
            <div className="space-y-2">
              {ADMIN_CONTACTS.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-amber-100"
                >
                  <span>{contact.label}</span>
                  <span className="font-medium text-slate-700">
                    {contact.value}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setAdminOpen((c) => !c);
            setOpen(false);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:bg-amber-400"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Contact Admin</span>
        </button>
      </div>
    </>
  );
}
