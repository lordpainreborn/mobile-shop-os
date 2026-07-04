"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, X } from "lucide-react";

export default function PlatformSwitcher() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const w = window as unknown as Record<string, unknown>;
    setIsDesktop(
      ua.includes("electron") ||
      ua.includes("aioms-desktop") ||
      !!w.electron ||
      !!w.__TAURI__ ||
      !!w.__ELECTRON__
    );
  }, []);

  if (!visible || isDesktop) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 1 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-4 px-4"
      >
        <div className="relative pointer-events-auto">
          {/* Dismiss button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>

          {isDesktop ? null : (
            /* Web → Go to AIOMS exe */
            <a
              href="/download"
              className="group flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] transition-all duration-300"
            >
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span className="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-xs text-slate-400 font-medium">Switch to</span>
                <span className="text-sm font-bold text-white tracking-tight">
                  Go to <span className="text-emerald-400">AIOMS.exe</span>
                </span>
              </div>
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
