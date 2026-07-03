"use client";

import { useEffect, useRef, useState } from "react";

const QUICK_TOPICS = [
  { label: "📦 Add Product Tutorial", prompt: "How do I add or edit products and manage inventory?" },
  { label: "🛠️ Open Repair Ticket", prompt: "How do I open a repair ticket and update device status?" },
  { label: "🛒 POS Guide", prompt: "How do I use the POS sales flow and checkout?" },
];

const ADMIN_CONTACT_CARD = {
  title: "🆘 System Admin Contact",
  subtitle: "For urgent issues, technical problems, or requests outside Mobile Shop OS scope, contact the admin directly:",
  contacts: [
    { label: "📱 Telegram", value: "@LordPainReborn", url: "https://t.me/LordPainReborn" },
    { label: "📞 Phone", value: "+959961089869", url: "tel:+959961089869" },
    { label: "💬 Viber", value: "+959798293948", url: "viber://chat?number=%2B959798293948" },
    { label: "🌐 Facebook", value: "Bhone Myat Paing", url: "https://www.facebook.com/BhoneMyatPaing" },
  ],
};

const ESCALATE_TAG = "[ESCALATE_ADMIN]";
const ESCALATION_KEYWORDS = [
  "contact admin",
  "system admin",
  "technical bug",
  "out of scope",
  "need human help",
  "cannot help",
  "don't have this info",
];

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  adminCard?: boolean;
};

export default function HelpAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I am your Mobile Shop OS assistant. Ask me about Products, Repairs, or Sales in English or Burmese.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lastMessage = messages[messages.length - 1];
  const hasAssistantMessage = lastMessage?.role === "assistant";

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const createMessage = (role: Message["role"], text: string, adminCard = false): Message => ({
    id: `${role}-${Date.now()}-${Math.random()}`,
    role,
    text,
    adminCard,
  });

  const isEscalationResponse = (text: string) => {
    const normalized = text.toLowerCase();
    return (
      normalized.includes(ESCALATE_TAG.toLowerCase()) ||
      ESCALATION_KEYWORDS.some((keyword) => normalized.includes(keyword))
    );
  };

  const cleanEscalationText = (text: string) => text.replace(ESCALATE_TAG, "").trim();

  const renderMessageContent = (message: Message) => {
    const displayText = cleanEscalationText(message.text);
    return <span>{displayText}</span>;
  };

  const renderEscalationCard = (message: Message) => {
    if (message.role !== "assistant") return null;
    const cleanedText = cleanEscalationText(message.text);
    if (!isEscalationResponse(message.text)) return null;

    return (
      <div className="mt-2 rounded-3xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-900 shadow-sm">
        <p className="mb-2 font-semibold text-slate-900">Need help from the System Admin?</p>
        <div className="space-y-2">
          {ADMIN_CONTACT_CARD.contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-3 py-2 transition hover:bg-amber-100"
            >
              <span>{contact.label}</span>
              <span className="font-medium text-slate-700">{contact.value}</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMessage = createMessage("user", trimmed);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, text }) => ({ role, content: text })),
        }),
      });

      const data = await response.json();
      const assistantText = data?.answer || data?.error || "I couldn't get a response. Please try again.";

      setMessages((current) => [...current, createMessage("assistant", assistantText)]);
    } catch (error) {
      setMessages((current) => [...current, createMessage("assistant", "There was an error fetching help. Please try again.")]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendPrompt(input);
  };

  const showAdminContactCard = () => {
    setAdminPanelOpen((current) => !current);
  };

  const quickButtons = QUICK_TOPICS.map((topic) => (
    <button
      key={topic.label}
      type="button"
      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      onClick={() => sendPrompt(topic.prompt)}
    >
      {topic.label}
    </button>
  ));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[360px] max-w-[90vw] rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between px-2 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">AI Help & Tutorial</p>
              <p className="text-xs text-slate-500">Ask in English or Burmese</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2 px-1">{quickButtons}</div>

          <div className="mb-3 flex items-center justify-between gap-2 px-1">
            <button
              type="button"
              onClick={showAdminContactCard}
              className="min-w-0 rounded-2xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-amber-400"
            >
              🆘 Contact Admin
            </button>
            <p className="text-xs text-slate-500">Need help with a bug or out-of-scope question? Tap to escalate.</p>
          </div>

          <div
            ref={containerRef}
            className="mb-3 max-h-72 space-y-3 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-3"
          >
            {messages.map((message) => {
              const displayText = cleanEscalationText(message.text);
              return (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm shadow-sm break-words whitespace-pre-wrap ${
                        message.role === "assistant"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      <span>{displayText}</span>
                    </div>
                  </div>
                  {renderEscalationCard({ ...message, text: displayText })}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-slate-500">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-slate-500" />
                Loading assistant...
              </div>
            )}
          </div>

          <form className="flex gap-2" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask how to use a feature..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col items-end gap-3">
        {adminPanelOpen && (
          <div className="w-[320px] max-w-[90vw] rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-900">🆘 Contact Admin</p>
              <p className="text-xs text-slate-600">Need urgent help? Use any of the links below.</p>
            </div>
            <div className="space-y-2">
              {ADMIN_CONTACT_CARD.contacts.map((contact) => (
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
            onClick={showAdminContactCard}
            className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-2xl transition hover:bg-amber-400"
          >
            📞 Contact Admin
          </button>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl transition hover:bg-slate-800"
            aria-label="Open AI help assistant"
          >
            <span className="text-2xl">💬</span>
          </button>
        </div>
      </div>
    </div>
  );
}
