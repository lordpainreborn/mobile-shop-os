"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const QUICK_TOPICS = [
  { label: "📦 Add Product Tutorial", prompt: "How do I add or edit products and manage inventory?" },
  { label: "🛠️ Open Repair Ticket", prompt: "How do I open a repair ticket and update device status?" },
  { label: "🛒 POS Guide", prompt: "How do I use the POS sales flow and checkout?" },
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

  const createMessage = (role: Message["role"], text: string): Message => ({
    id: `${role}-${Date.now()}-${Math.random()}`,
    role,
    text,
  });

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMessage = createMessage("user", trimmed);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
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

  const quickButtons = useMemo(
    () => QUICK_TOPICS.map((topic) => (
      <button
        key={topic.label}
        type="button"
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        onClick={() => sendPrompt(topic.prompt)}
      >
        {topic.label}
      </button>
    )),
    []
  );

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

          <div
            ref={containerRef}
            className="mb-3 max-h-72 space-y-3 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                    message.role === "assistant"
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  {message.text.split("\n").map((line, index) => (
                    <p key={`line-${index}`} className="leading-6">
                      {line}
                    </p>
                  ))}
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

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl transition hover:bg-slate-800"
        aria-label="Open AI help assistant"
      >
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
}
