"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";

const QUICK_TOPICS = [
  { label: "Add Product Tutorial", prompt: "How do I add or edit products and manage inventory?" },
  { label: "Open Repair Ticket", prompt: "How do I open a repair ticket and update device status?" },
  { label: "POS Guide", prompt: "How do I use the POS sales flow and checkout?" },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
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
  const [cooldown, setCooldown] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timeout = setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  const createMessage = (role: Message["role"], text: string): Message => ({
    id: `${role}-${Date.now()}-${Math.random()}`,
    role,
    text,
  });

  const renderMessageContent = (message: Message) => {
    return <span>{message.text}</span>;
  };

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || cooldown > 0) return;

    const userMessage = createMessage("user", trimmed);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setCooldown(4);

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
            >Close</button>
          </div>

          <div className="mb-3 flex flex-wrap gap-2 px-1">{quickButtons}</div>

          <div
            ref={containerRef}
            className="mb-3 max-h-72 space-y-3 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-3"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm shadow-sm break-words whitespace-pre-wrap ${
                    message.role === "assistant"
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
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
              disabled={loading || cooldown > 0}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {cooldown > 0 ? `ခဏစောင့်ပါ (${cooldown}s)` : "Send"}
            </button>
          </form>
        </div>
      )}

      {adminOpen && (
        <div className="w-[300px] max-w-[90vw] rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">Contact Admin</p>
            <p className="text-xs text-slate-600">Need urgent help? Reach out via any channel.</p>
          </div>
          <div className="space-y-2">
            <a href="https://t.me/LordPainReborn" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-amber-100">
              <span>Telegram</span>
              <span className="font-medium text-slate-700">@LordPainReborn</span>
            </a>
            <a href="tel:+959961089869" className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-amber-100">
              <span>Phone</span>
              <span className="font-medium text-slate-700">+959961089869</span>
            </a>
            <a href="viber://chat?number=%2B959798293948" className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-amber-100">
              <span>Viber</span>
              <span className="font-medium text-slate-700">+959798293948</span>
            </a>
            <a href="https://www.facebook.com/BhoneMyatPaing" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-amber-100">
              <span>Facebook</span>
              <span className="font-medium text-slate-700">Bhone Myat Paing</span>
            </a>
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
          aria-label="Open AI help assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
