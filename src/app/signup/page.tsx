"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, Info, Smartphone, Shield, Zap, Globe } from "lucide-react";
import { sendSignupOTP, verifySignupOTP } from "@/actions/signupActions";

type Step = "form" | "verify";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fallbackCode, setFallbackCode] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFallbackCode(null);
    setLoading(true);

    try {
      const result = await sendSignupOTP({ shopName, ownerName, email, password });
      if (result.success) {
        setStep("verify");
        if (result.fallbackCode) {
          setFallbackCode(result.fallbackCode);
        }
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

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row">
      {/* Left Panel — Blue Marketing */}
      <div className="lg:w-[55%] bg-blue-600 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] bg-indigo-500/30 rounded-full blur-[80px]" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 lg:mb-20">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AIOMS</span>
          </div>

          {/* Marketing Content */}
          <div className="max-w-md">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-4">
              AIOMS v2.0 — Next-Gen POS Platform
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              Start creating
              <br />
              your shop account
            </h1>
            <p className="text-blue-100 text-base lg:text-lg leading-relaxed mb-10">
              ဖုန်းဆိုင်လုပ်ငန်းများအတွက် Windows PC Application နှင့် Cloud Web
              Portal တစ်ခုတည်းတွင် အရောင်း၊ ပြင်ဆင်ရေး၊ စတော့၊ ဝန်ထမ်း
              စီမံခန့်ခွဲပါ။
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: <Shield className="w-5 h-5" />, text: "Multi-Shop Isolation & Security" },
                { icon: <Zap className="w-5 h-5" />, text: "Offline / Online Data Sync" },
                { icon: <Globe className="w-5 h-5" />, text: "Cloud Web Portal Access" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div className="relative z-10 mt-12 lg:mt-0">
          <a href="/login" className="text-blue-200 text-sm hover:text-white transition">
            Already have an account? Sign In →
          </a>
        </div>
      </div>

      {/* Right Panel — White Form */}
      <div className="lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-12 overflow-auto">
        <div className="w-full max-w-[400px]">
          {/* Back button for verify step */}
          {step === "verify" && (
            <button
              onClick={() => { setStep("form"); setError(""); setCode(""); setFallbackCode(null); }}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to form
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {step === "form" ? "Create account" : "Verify your email"}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {step === "form"
              ? "Fill in the details below to get started."
              : "Enter the 6-digit code sent to your email."}
          </p>

          {/* Success banner */}
          {step === "verify" && (
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
              <p className="text-sm text-blue-700">
                Code sent to <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}

          {/* Fallback code notice */}
          {fallbackCode && (
            <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200">
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
            </div>
          )}

          <form onSubmit={step === "form" ? handleSendOTP : handleVerifyOTP} className="space-y-5">
            {step === "form" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Yangon Mobile Hub"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Aung Min"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@shop.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>
              </>
            )}

            {step === "verify" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-center text-2xl font-mono font-bold text-gray-900 tracking-[0.3em] placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step === "form" ? "Sending code..." : "Verifying..."}
                </>
              ) : step === "form" ? (
                "Send OTP Code"
              ) : (
                "Verify & Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
