"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlowCard,
  FloatingBlob,
  MaskRevealText,
  StaggeredInput,
  LiquidButton,
  AnimatedGroup,
  AnimatedItem,
} from "@/components/MotionPrimitives";

function isDesktopEnv() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const w = window as unknown as Record<string, unknown>;
  return (
    ua.includes("electron") ||
    ua.includes("aioms-desktop") ||
    !!w.electron ||
    !!w.__TAURI__ ||
    !!w.__ELECTRON__
  );
}

const WEB_PORTAL = "https://mobile-shop-os.vercel.app";

function AnimatedInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  desktop,
  rightElement,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  autoFocus?: boolean;
  desktop: boolean;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative group">
      <motion.label
        className={`absolute left-4 transition-colors duration-300 pointer-events-none z-10 ${
          isActive
            ? "top-2 text-[10px] font-semibold tracking-wide"
            : "top-3.5 text-sm"
        } ${
          isActive
            ? focused
              ? "text-blue-500"
              : desktop
              ? "text-slate-400"
              : "text-gray-400"
            : desktop
            ? "text-slate-400"
            : "text-gray-400"
        }`}
        animate={isActive ? { y: 0 } : { y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={focused ? placeholder : ""}
          required={required}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full pt-7 pb-2.5 px-4 rounded-xl border text-sm outline-none transition-all duration-300 ${
            desktop
              ? `border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 ${
                  focused
                    ? "border-blue-400 ring-2 ring-blue-500/20 bg-slate-700/80 shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]"
                    : "hover:border-slate-500"
                }`
              : `border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 ${
                  focused
                    ? "border-blue-400 ring-2 ring-blue-100 bg-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.12)]"
                    : "hover:border-gray-300"
                }`
          }`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktopEnv());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const role = data.user?.role;
      const isDesktop = isDesktopEnv();
      if (role === "SUPER_ADMIN") {
        window.location.href = "/admin";
      } else if (isDesktop) {
        window.location.href = "/sales";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  function handleExternalLink(path: string) {
    window.open(`${WEB_PORTAL}${path}`, "_blank");
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 overflow-auto ${
        desktop ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : ""
      }`}
      style={
        desktop
          ? undefined
          : {
              background:
                "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 15%, #7dd3fc 30%, #38bdf8 50%, #818cf8 70%, #c084fc 85%, #f0abfc 100%)",
            }
      }
    >
      {/* Animated ambient blobs */}
      {!desktop && (
        <>
          <FloatingBlob
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/40 rounded-full blur-[100px]"
            delay={0}
          />
          <FloatingBlob
            className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-300/40 rounded-full blur-[100px]"
            delay={5}
          />
          <FloatingBlob
            className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-300/30 rounded-full blur-[80px]"
            delay={10}
          />
        </>
      )}

      {desktop && (
        <>
          <FloatingBlob
            className="absolute top-[15%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]"
            delay={0}
          />
          <FloatingBlob
            className="absolute bottom-[15%] right-[20%] w-[250px] h-[250px] bg-indigo-600/10 rounded-full blur-[80px]"
            delay={7}
          />
        </>
      )}

      <div className="w-full max-w-[420px] relative z-10">
        <GlowCard
          className={`rounded-3xl shadow-2xl p-8 sm:p-10 ${
            desktop
              ? "bg-slate-800/90 backdrop-blur-md border border-slate-700/50 shadow-black/40"
              : "bg-white/80 backdrop-blur-xl border border-white/20 shadow-black/10"
          }`}
        >
          {/* Header */}
          <AnimatedGroup className="text-center mb-8">
            <AnimatedItem>
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                <Logo
                  className={`w-16 h-16 mx-auto rounded-2xl mb-4 ${
                    desktop ? "shadow-lg shadow-blue-500/20" : "shadow-lg shadow-blue-500/20"
                  }`}
                />
              </motion.div>
            </AnimatedItem>
            <AnimatedItem>
              <h1
                className={`text-2xl font-bold tracking-tight ${
                  desktop ? "text-white" : "text-gray-900"
                }`}
              >
                <MaskRevealText text={desktop ? "AIOMS Desktop" : "Log in"} />
              </h1>
            </AnimatedItem>
            <AnimatedItem>
              {!desktop && (
                <p className="text-sm text-gray-500 mt-2">
                  New to AIOMS?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign up for free
                  </a>
                </p>
              )}
              {desktop && (
                <p className="text-sm text-slate-400 mt-2">
                  New to AIOMS?{" "}
                  <button
                    onClick={() => handleExternalLink("/signup")}
                    className="text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign up on Web
                  </button>
                </p>
              )}
            </AnimatedItem>
          </AnimatedGroup>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <StaggeredInput index={0}>
              <AnimatedInput
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@shop.com or your name"
                required
                autoFocus
                desktop={desktop}
              />
            </StaggeredInput>

            <StaggeredInput index={1}>
              <AnimatedInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                desktop={desktop}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`transition p-1 ${
                      desktop
                        ? "text-slate-400 hover:text-slate-200"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </StaggeredInput>

            <StaggeredInput index={2}>
              <div className="flex items-center justify-end">
                {desktop ? (
                  <button
                    type="button"
                    onClick={() => handleExternalLink("/forgot-password")}
                    className="text-sm text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    Forget password?
                  </button>
                ) : (
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Forget password?
                  </a>
                )}
              </div>
            </StaggeredInput>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium overflow-hidden ${
                    desktop
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <StaggeredInput index={3}>
              <LiquidButton
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  desktop
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Log in"
                )}
              </LiquidButton>
            </StaggeredInput>
          </form>
        </GlowCard>
      </div>
    </div>
  );
}
