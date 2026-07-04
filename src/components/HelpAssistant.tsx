"use client";

import { useState } from "react";
import { MessageCircle, Phone, ArrowLeft, Package, Wrench, ShoppingCart, Shield } from "lucide-react";

type TutorialId = "products" | "repairs" | "pos" | "system";

type TutorialCategory = {
  id: TutorialId;
  emoji: string;
  titleMy: string;
  titleEn: string;
  icon: React.ReactNode;
  steps: { my: string; en: string }[];
};

const TUTORIALS: TutorialCategory[] = [
  {
    id: "products",
    emoji: "\u{1F4E6}",
    titleMy: "\u{1F4E6} \u{1000}\u{102B}\u{1015}\u{103A}\u{1019}\u{102C}\u{1021}\u{1000}\u{1031}\u{1019}\u{1014}\u{1039}\u{1018}\u{1030} \u{1031}\u{1019}\u{102C}\u{1038}\u{1021}\u{103B}\u{1025}\u{103A}\u{1014}\u{1031}\u{101C}\u{103A}",
    titleEn: "Products Guide",
    icon: <Package className="h-5 w-5" />,
    steps: [
      { my: "\u{1021}\u{103B}\u{1025}\u{103A} Products \u{101E}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}\u{1001}\u{1031}\u{102E}\u{1024}", en: "Navigate to the Products page from the sidebar menu." },
      { my: "\u{1021}\u{103B}\u{1025}\u{103A} \"Add Product\" \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}", en: 'Click the "Add Product" button at the top of the page.' },
      { my: "\u{1021}\u{1031}\u{101C}\u{103A}\u{1019}\u{1039}\u{1018}\u{1030} \u{1000}\u{102B}\u{1015}\u{103A}\u{1019}\u{102C}\u{102C}\u{1021}\u{103A}\u{1038}\u{1039}\u{1038}\u{1032}\u{1021}\u{1031}\u{102C}\u{1026}\u{1023}\u{102C}\u{100A}\u{1019}\u{1014}\u{1039}\u{1019}\u{1038}\u{103A}\u{101A}\u{103B}\u{102F}\u{1024}", en: "Fill in the product name, category (PHONE / ACCESSORY / PART), cost, selling price, and stock quantity." },
      { my: "\"Save\" \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}\u{1021}\u{1031}\u{102C} \u{1015}\u{1031}\u{1010}\u{103A}\u{1019}\u{1039}\u{1015}\u{104A}", en: 'Click "Save" to add the product to your live inventory.' },
      { my: "Product \u{1000}\u{1031}\u{1010}\u{103A}\u{1019}\u{1039}\u{1015}\u{104A} \u{1001}\u{103B}\u{1025}\u{103A} Edit \u{1016}\u{103D}\u{1019}\u{103A} Delete \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A} \u{1021}\u{103B}\u{1025}\u{103A} \u{101C}\u{103B}\u{102F}\u{1024}", en: "Use Edit and Delete buttons on each product row to manage records." },
    ],
  },
  {
    id: "repairs",
    emoji: "\u{1F6E0}\u{FE0F}",
    titleMy: "\u{1F6E0}\u{FE0F} \u{101F}\u{102F}\u{1019}\u{103A}\u{1014}\u{1031}\u{101C}\u{103A}\u{102E}\u{1031}\u{102C}\u{103A}\u{1010}\u{103A}\u{1026} \u{102C}\u{1031}\u{1026}\u{1015}\u{103A}\u{1025}\u{1038}\u{1021}\u{103A}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}",
    titleEn: "Repairs Guide",
    icon: <Wrench className="h-5 w-5" />,
    steps: [
      { my: "\u{1021}\u{103B}\u{1025}\u{103A} Repairs \u{101E}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}\u{1001}\u{1031}\u{102E}\u{1024}", en: "Navigate to the Repairs page from the sidebar." },
      { my: "\"New Ticket\" \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}", en: 'Click "New Ticket" to create a repair entry.' },
      { my: "\u{1002}\u{103B}\u{1014}\u{103A}\u{1019}\u{102C}\u{1039}\u{1039}\u{1015}\u{103B}\u{102C}\u{1031}\u{1021}\u{103A} \u{1000}\u{102B}\u{1015}\u{103A}\u{1019}\u{102C}\u{102C}\u{1021}\u{103A}\u{1038}\u{1039}\u{1038}\u{1032}\u{1021}\u{1031}\u{102C}\u{1026}\u{1023}\u{102C}\u{100A}\u{1019}\u{1014}\u{1039}\u{1019}\u{1038}\u{103A} \u{101A}\u{103B}\u{102F}\u{1024}", en: "Enter customer name, phone, device model, issue description, and estimated cost." },
      { my: "\"Save\" \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}\u{1021}\u{1031}\u{102C} \u{1015}\u{1031}\u{1010}\u{103A}\u{1019}\u{1039}\u{1015}\u{104A}", en: 'Click "Save" to create the repair ticket.' },
      { my: "Status \u{1000}\u{1031}\u{1010}\u{103A}\u{1019}\u{1039}\u{1015}\u{104A} PENDING \u{2192} CHECKING \u{2192} REPAIRING \u{2192} READY \u{2192} DELIVERED \u{101A}\u{103B}\u{102F}\u{1024}", en: "Update status as work progresses: PENDING \u{2192} CHECKING \u{2192} REPAIRING \u{2192} READY \u{2192} DELIVERED." },
      { my: "\u{1021}\u{103B}\u{1025}\u{103A} Technician \u{1021}\u{103B}\u{1025}\u{103A}\u{1038}\u{103A}\u{1021}\u{103A}\u{1019}\u{103A} \u{1019}\u{1031}\u{1010}\u{103A}\u{1038}\u{1039}\u{103A} \u{1027}\u{1039}\u{1019}\u{1031}\u{102C}\u{100A}\u{1024}", en: "Assign a Technician to the ticket and update progress notes." },
    ],
  },
  {
    id: "pos",
    emoji: "\u{1F6D2}",
    titleMy: "\u{1F6D2} \u{1000}\u{1031}\u{102C}\u{103D}\u{1039}\u{1010}\u{103A}\u{1026} \u{102C}\u{1031}\u{1026}\u{1015}\u{103A}\u{1025}\u{1038}\u{1021}\u{103A}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}",
    titleEn: "POS Checkout Guide",
    icon: <ShoppingCart className="h-5 w-5" />,
    steps: [
      { my: "\u{1021}\u{103B}\u{1025}\u{103A} Sales \u{101E}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}\u{1001}\u{1031}\u{102E}\u{1024}", en: "Navigate to the Sales (POS) page from the sidebar." },
      { my: "Barcode Scanner \u{1016}\u{103D}\u{1019}\u{103A} Search Bar \u{1031}\u{102C} Product Name \u{1005}\u{102F}\u{1039}\u{1015}\u{103B}\u{1014}\u{103A}\u{1021}\u{103A}\u{1019}\u{103A} \u{1010}\u{103A}\u{1021}\u{102D}\u{102F}\u{1036}\u{1038}\u{103A}", en: "Scan a barcode or search by product name to find items." },
      { my: "Product \u{1021}\u{103A}\u{1019}\u{103A} Cart \u{1031}\u{102C}\u{1038}\u{1039}\u{102C}\u{103A}\u{1019}\u{103A} Quantity \u{1010}\u{103A}\u{1021}\u{102D}\u{102F}\u{1036}\u{1038}\u{103A}", en: "Add products to the cart and adjust quantities as needed." },
      { my: "Payment Method \u{1021}\u{103B}\u{1025}\u{103A} \u{1021}\u{103B}\u{1031}\u{1010}\u{103A}\u{1026}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}\u{1021}\u{1031}\u{102C} Cash / KBZ Pay / Wave Money \u{1019}\u{103B}\u{1014}\u{1039}\u{1019}\u{1038}\u{103A} \u{101A}\u{103B}\u{102F}\u{1024}", en: "Select a payment method (Cash, KBZ Pay, Wave Money, etc.)." },
      { my: "\"Checkout\" \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}\u{1021}\u{1031}\u{102C} Sale \u{102C}\u{1031}\u{1026}\u{1015}\u{103A}\u{1025}\u{1038}\u{1038}\u{103A}\u{1019}\u{103A} \u{101C}\u{103B}\u{102F}\u{1024}\u{1021}\u{1031}\u{102C} Stock \u{1019}\u{103B}\u{1014}\u{1039}\u{1039}\u{1015}\u{103A}\u{1019}\u{102C}\u{1031}\u{101A}\u{1039}\u{1039}\u{1039}\u{1024}", en: 'Click "Checkout" to record the sale. Stock will update automatically.' },
    ],
  },
  {
    id: "system",
    emoji: "\u{1F510}",
    titleMy: "\u{1F510} \u{1000}\u{102B}\u{1014}\u{1039}\u{1021}\u{1039}\u{1031}\u{102C}\u{102F}\u{1036}\u{1038}\u{1010}\u{1038}\u{1037}\u{1031}\u{1038}\u{1039}\u{1038}\u{1038}\u{1038}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}",
    titleEn: "System & Account Guide",
    icon: <Shield className="h-5 w-5" />,
    steps: [
      { my: "Login Page \u{1031}\u{102C} Email \u{1016}\u{103D}\u{1019}\u{103A} Password \u{1010}\u{103A}\u{1021}\u{102D}\u{102F}\u{1036}\u{1038}\u{103A}\u{1021}\u{1031}\u{102C} \"Log In\" \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}", en: "Enter your email and password on the Login page, then click Log In." },
      { my: "Admin \u{1021}\u{103B}\u{1025}\u{103A} Staff \u{101E}\u{1031}\u{102C}\u{1004}\u{1039}\u{1018}\u{1030}\u{1037}\u{102D}\u{100A}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}\u{1031}\u{102C} User Management \u{1031}\u{102C} \u{1019}\u{102C}\u{1039}\u{1039}\u{1015}\u{103B}\u{1014}\u{103A}\u{1021}\u{103A}\u{1019}\u{103A} \u{101C}\u{103B}\u{102F}\u{1024}", en: "Admins can manage staff accounts via User Management in the Staff page." },
      { my: "Roles \u{1031}\u{102C} ADMIN \u{1010}\u{1038}\u{103A} TECHNICIAN \u{1010}\u{1038}\u{103A} CASHIER \u{1021}\u{103B}\u{1025}\u{103A}\u{1038}\u{103A}\u{1021}\u{103A}\u{1019}\u{103A} \u{101C}\u{103B}\u{102F}\u{1024}", en: "Three roles available: ADMIN (full access), TECHNICIAN (repairs), CASHIER (POS)." },
      { my: "Dashboard \u{101E}\u{1031}\u{102C} \u{1001}\u{102D}\u{102F}\u{1036}\u{1039}\u{1038}\u{1038}\u{1038}\u{1031}\u{102C}\u{1026}\u{1023}\u{102C}\u{100A}\u{1019}\u{102C}\u{1039}\u{1039}\u{1015}\u{103B}\u{1014}\u{103A}\u{1019}\u{1038}\u{103A} \u{102C}\u{1031}\u{1026}\u{1015}\u{103A}\u{1025}\u{1038}\u{1021}\u{103A}\u{1019}\u{103A} \u{1027}\u{1039}\u{1019}\u{1031}\u{102C}\u{100A}\u{1024}", en: "The Dashboard shows sales totals, repair status, and product overview." },
      { my: "\u{1021}\u{103B}\u{1025}\u{103A} \u{1019}\u{1031}\u{1019}\u{102C}\u{1039}\u{1039}\u{1015}\u{103B}\u{1014}\u{103A}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}\u{1021}\u{103A} \u{1021}\u{103B}\u{1025}\u{103A} \u{1021}\u{1039}\u{1021}\u{1031}\u{102C}\u{1000}\u{1038}\u{1039}\u{1014}\u{1039}\u{102F}\u{1036}\u{1038}\u{1031}\u{102C} Contact Admin \u{1000}\u{103B}\u{1019}\u{103A}\u{1015}\u{103B}\u{102C}\u{1031}\u{1038}\u{103A}\u{1001}\u{103B}\u{1019}\u{103A}", en: "For password resets or access issues, use the Contact Admin button below." },
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] max-w-[90vw] rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between px-2 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {"\u{1F4DA}"} System Tutorials & Help
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
                    {selectedTutorial.emoji} {selectedTutorial.titleMy}
                  </p>
                  <p className="text-xs text-slate-500">{selectedTutorial.titleEn}</p>
                </div>

                <div className="space-y-3">
                  {selectedTutorial.steps.map((step, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-900">{step.my}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{step.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="mb-2 px-1 text-xs font-medium text-slate-500">Select a topic:</p>
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
                      <span className="block text-sm font-semibold text-slate-900 truncate">{tutorial.titleMy}</span>
                      <span className="block text-xs text-slate-500 truncate">{tutorial.titleEn}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {adminOpen && (
        <div className="w-[300px] max-w-[90vw] rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">Contact Admin</p>
            <p className="text-xs text-slate-600">Need urgent help? Reach out via any channel.</p>
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
                <span className="font-medium text-slate-700">{contact.value}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { setAdminOpen((c) => !c); setOpen(false); }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-2xl transition hover:bg-amber-400"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Contact Admin</span>
        </button>

        <button
          type="button"
          onClick={() => { setOpen((c) => !c); setAdminOpen(false); }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl transition hover:bg-slate-800"
          aria-label="Open tutorials and help"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
