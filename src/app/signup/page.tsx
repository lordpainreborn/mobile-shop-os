"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Smartphone, ArrowLeft, CheckCircle2 } from "lucide-react";
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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await sendSignupOTP({ shopName, ownerName, email, password });
      if (result.success) {
        setStep("verify");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-5">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mobile Shop OS
          </h1>
          <p className="text-slate-400 text-base mt-2">
            {step === "form" ? "Create your shop account" : "Verify your email"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 sm:p-10">
          {step === "verify" && (
            <button
              onClick={() => { setStep("form"); setError(""); setCode(""); }}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to form
            </button>
          )}

          {step === "verify" && (
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
              <p className="text-sm text-blue-300">
                A 6-digit code has been sent to <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}

          <form onSubmit={step === "form" ? handleSendOTP : handleVerifyOTP} className="space-y-6">
            {step === "form" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Yangon Mobile Hub"
                    required
                    autoFocus
                    className="w-full px-4 py-3.5 sm:p-4 rounded-xl border border-slate-700 bg-slate-800 text-base text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Aung Min"
                    required
                    className="w-full px-4 py-3.5 sm:p-4 rounded-xl border border-slate-700 bg-slate-800 text-base text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@shop.com"
                    required
                    className="w-full px-4 py-3.5 sm:p-4 rounded-xl border border-slate-700 bg-slate-800 text-base text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 sm:p-4 rounded-xl border border-slate-700 bg-slate-800 text-base text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </>
            )}

            {step === "verify" && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-3.5 sm:p-4 rounded-xl border border-slate-700 bg-slate-800 text-center text-2xl font-mono font-bold text-white tracking-[0.3em] placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 sm:py-4 text-base font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {step === "form" ? "Sending code..." : "Verifying..."}
                </>
              ) : step === "form" ? (
                "Send OTP Code"
              ) : (
                "Verify & Create Shop Account"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <a
              href="/login"
              className="flex items-center justify-center w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              အကောင့်ရှိပြီးသားဖြစ်ပါက (Already have an account? Sign In)
            </a>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Secure multi-tenant management platform
        </p>
      </div>
    </div>
  );
}
