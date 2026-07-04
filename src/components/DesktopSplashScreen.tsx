"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

function playStartupChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.8);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25);
    gain2.gain.setValueAtTime(0.09, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 2.0);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(392, now + 0.2);
    gain3.gain.setValueAtTime(0.06, now + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    osc3.connect(gain3).connect(ctx.destination);
    osc3.start(now + 0.2);
    osc3.stop(now + 2.2);
  } catch {
    /* audio not supported — fail silently */
  }
}

export default function DesktopSplashScreen() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const chimePlayed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("aioms-splash-seen");
    if (seen) {
      setDone(true);
      return;
    }
    setShow(true);
    if (!chimePlayed.current) {
      chimePlayed.current = true;
      playStartupChime();
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("aioms-splash-seen", "1");
      setShow(false);
      setTimeout(() => setDone(true), 600);
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[90px]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]"
            />
          </div>

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo — Cinematic Scale */}
            <motion.div
              initial={{ scale: 1.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
            >
              <Logo className="w-28 h-28 rounded-3xl shadow-2xl shadow-blue-600/30" />
            </motion.div>

            {/* Brand Text — Slide Up + Gradient Shimmer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-amber-300 to-white">
                All In One Mobile Shop
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-sm text-slate-500 mt-2 tracking-wide"
              >
                POS Operating System
              </motion.p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden mt-4"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1.4, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
