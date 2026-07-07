"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, Info, Smartphone, Shield, Zap, Globe } from "lucide-react";
import { sendSignupOTP, verifySignupOTP, resendSignupOTP } from "@/actions/signupActions";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabase } from "@/lib/supabase";
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

type Step = "form" | "verify";

function AnimatedInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  maxLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
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
        } ${isActive ? (focused ? "text-blue-500" : "text-gray-400") : "text-gray-400"}`}
      >
        {label}
      </motion.label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder : ""}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full pt-7 pb-2.5 px-4 rounded-xl border text-sm outline-none transition-all duration-300 ${
          type === "text" && maxLength === 6
            ? "text-center text-2xl font-mono font-bold tracking-[0.3em]"
            : ""
        } border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 ${
          focused
            ? "border-blue-400 ring-2 ring-blue-100 bg-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.12)]"
            : "hover:border-gray-300"
        }`}
      />
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const [step, setStep] = useState<Step>("form");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fallbackCode, setFallbackCode] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendOTP = async () => {
    if (resending || resendCooldown > 0) return;
    setError("");
    setResending(true);
    try {
      const result = await resendSignupOTP(email);
      if (result.success) {
        if (result.fallbackCode) setFallbackCode(result.fallbackCode);
        setResendCooldown(30);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.error || "Failed to resend code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFallbackCode(null);
    setLoading(true);
    try {
      const result = await sendSignupOTP({ shopName, ownerName, email, password });
      if (result.success) {
        setStep("verify");
        if (result.fallbackCode) setFallbackCode(result.fallbackCode);
      } else {
        setError(result.error || "Failed to send verification code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await verifySignupOTP({ shopName, ownerName, email, password, code });
      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Verification failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/account` },
      });
      if (error) setError(error.message);
    } catch {
      setError("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row">
      {/* Left Panel — Blue Marketing */}
      <div className="lg:w-[55%] bg-blue-600 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <FloatingBlob className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-[80px]" delay={0} />
        <FloatingBlob className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] bg-indigo-500/30 rounded-full blur-[80px]" delay={5} />

        <div className="relative z-10">
          <AnimatedGroup className="mb-12 lg:mb-20">
            <AnimatedItem>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
                >
                  <Smartphone className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold text-white">AIOMS</span>
              </div>
            </AnimatedItem>
          </AnimatedGroup>

          <div className="max-w-md">
            <AnimatedGroup>
              <AnimatedItem>
                <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4">
                  AIOMS v2.0
                </p>
              </AnimatedItem>
              <AnimatedItem>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                  <MaskRevealText
                    text={language === "en" ? "Start creating" : "သင့်ဖုန်းဆိုင်"}
                    delay={0.1}
                  />
                  <br />
                  <MaskRevealText
                    text={language === "en" ? "your shop account" : "အကောင့်သစ် ဖန်တီးလိုက်ပါ"}
                    delay={0.25}
                  />
                </h1>
              </AnimatedItem>
              <AnimatedItem>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed mb-10">
                  {language === "en"
                    ? "All-in-one POS system for mobile shops — sales, repairs, inventory, and staff management."
                    : "ဖုန်းဆိုင်လုပ်ငန်းများအတွက် Windows PC Application နှင့် Cloud Web Portal တစ်ခုတည်းတွင် အရောင်း၊ ပြင်ဆင်ရေး၊ စတော့၊ ဝန်ထမ်း စီမံခန့်ခွဲပါ။"}
                </p>
              </AnimatedItem>
            </AnimatedGroup>

            <AnimatedGroup className="space-y-4" delay={0.4}>
              {[
                { icon: <Shield className="w-5 h-5" />, text: language === "en" ? "Multi-Shop Isolation & Security" : "ဆိုင်တစ်ဆိုင်ချင်စီ လုံခြုံမှု" },
                { icon: <Zap className="w-5 h-5" />, text: language === "en" ? "Offline / Online Data Sync" : "အော့ဖ်လိုင်း / အွန်လိုင်း ဒေတာ Sync" },
                { icon: <Globe className="w-5 h-5" />, text: language === "en" ? "Cloud Web Portal Access" : "Cloud Web Portal ဝင်ရောက်ခွင့်" },
              ].map((f, i) => (
                <AnimatedItem key={i}>
                  <div className="flex items-center gap-3 text-blue-100">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-sm">{f.text}</span>
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedGroup>
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <a href="/login" className="text-blue-200 text-sm hover:text-white transition">
            Already have an account? Sign In →
          </a>
        </div>
      </div>

      {/* Right Panel — White Form */}
      <div className="lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-12 overflow-auto">
        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            {step === "verify" && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => { setStep("form"); setError(""); setCode(""); setFallbackCode(null); }}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === "en" ? "Back to form" : "နောက်သို့"}
              </motion.button>
            )}
          </AnimatePresence>

          <GlowCard className="bg-white border-0 shadow-none p-0">
            <AnimatedGroup className="mb-8">
              <AnimatedItem>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  <MaskRevealText
                    text={
                      step === "form"
                        ? (language === "en" ? "Create account" : "အကောင့်ဖန်တီးရန်")
                        : (language === "en" ? "Verify your email" : "Email စစ်ဆေးရန်")
                    }
                  />
                </h2>
              </AnimatedItem>
              <AnimatedItem>
                <p className="text-sm text-gray-500">
                  {step === "form"
                    ? (language === "en" ? "Fill in the details below to get started." : "အောက်ပါအချက်အလက်များ ဖြည့်ပါ။")
                    : (language === "en" ? "Enter the 6-digit code sent to your email." : "သင့် Email သို့ ပို့ထားသော ကုဒ် ထည့်ပါ။")}
                </p>
              </AnimatedItem>
            </AnimatedGroup>

            <AnimatePresence mode="wait">
              {step === "verify" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-blue-50 border border-blue-100"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                  <p className="text-sm text-blue-700">
                    {language === "en" ? "Code sent to" : "ကုဒ်ပို့ပြီး"} <span className="font-semibold">{email}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {fallbackCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200"
              >
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Dev Mode — Email skipped</p>
                    <p className="text-xs text-amber-500 mt-1">Your verification code:</p>
                    <p className="text-xl font-mono font-bold text-amber-600 tracking-[0.2em] mt-1">
                      {fallbackCode}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={step === "form" ? handleSendOTP : handleVerifyOTP} className="space-y-5">
              {step === "form" && (
                <>
                  <StaggeredInput index={0}>
                    <AnimatedInput
                      label={language === "en" ? "Shop Name" : "ဆိုင်အမည်"}
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Yangon Mobile Hub"
                      required
                      autoFocus
                    />
                  </StaggeredInput>
                  <StaggeredInput index={1}>
                    <AnimatedInput
                      label={language === "en" ? "Your Name" : "သင့်အမည်"}
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Aung Min"
                      required
                    />
                  </StaggeredInput>
                  <StaggeredInput index={2}>
                    <AnimatedInput
                      label={language === "en" ? "Email address" : "Email လိပ်စာ"}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@shop.com"
                      required
                    />
                  </StaggeredInput>
                  <StaggeredInput index={3}>
                    <AnimatedInput
                      label={language === "en" ? "Password" : "စကားဝှက်"}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                    />
                  </StaggeredInput>
                </>
              )}

              {step === "verify" && (
                <>
                  <StaggeredInput index={0}>
                    <AnimatedInput
                      label={language === "en" ? "Verification Code" : "အတည်ပြုကုဒ်"}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      required
                      maxLength={6}
                      autoFocus
                    />
                  </StaggeredInput>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resending || resendCooldown > 0}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {resending
                        ? (language === "en" ? "Resending..." : "ပြန်ပို့နေသည်...")
                        : resendCooldown > 0
                        ? (language === "en" ? `Resend in ${resendCooldown}s` : `${resendCooldown}စက္ကန့်စောင့်ပါ`)
                        : (language === "en" ? "Resend verification code" : "အတည်ပြုကုဒ် ပြန်ပို့ရန်")}
                    </button>
                  </div>
                </>
              )}

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <StaggeredInput index={step === "form" ? 4 : 1}>
                <LiquidButton
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {step === "form"
                        ? (language === "en" ? "Sending code..." : "ကုဒ်ပို့နေသည်...")
                        : (language === "en" ? "Verifying..." : "စစ်ဆေးနေသည်...")}
                    </>
                  ) : step === "form" ? (
                    language === "en" ? "Send OTP Code" : "OTP ကုဒ်ပို့ရန်"
                  ) : (
                    language === "en" ? "Verify & Create Account" : "အကောင့်ဖန်တီးရန်"
                  )}
                </LiquidButton>
              </StaggeredInput>
            </form>

            {step === "form" && (
              <>
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 bg-white border border-slate-600 hover:bg-slate-100 transition shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            <p className="text-center text-gray-500 text-sm mt-8">
              {language === "en" ? "Already have an account?" : "အကောင့်ရှိပြီးသားလား?"}{" "}
              <a href="/login" className="text-blue-600 font-semibold hover:underline">
                {language === "en" ? "Log in" : "ဝင်ရန်"}
              </a>
            </p>

            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => language === "my" && toggleLanguage()}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  language === "en" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                English
              </button>
              <button
                onClick={() => language === "en" && toggleLanguage()}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  language === "my" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                မြန်မာ
              </button>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
