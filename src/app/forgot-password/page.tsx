"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Smartphone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { sendResetOTP, verifyResetOTP } from "@/actions/forgotPasswordActions";

type Step = "email" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await sendResetOTP({ email });
      if (result.success) {
        setStep("verify");
      } else {
        setError(result.error || "Failed to send reset code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyResetOTP({ email, code, newPassword });
      if (result.success) {
        router.push("/login?reset=success");
        router.refresh();
      } else {
        setError(result.error || "Reset failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Mobile Shop OS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {step === "email" ? "Reset your password" : "Enter verification code"}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          {step === "verify" && (
            <button
              onClick={() => { setStep("email"); setError(""); setCode(""); setNewPassword(""); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to email
            </button>
          )}

          {step === "verify" && (
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700">
                A 6-digit code has been sent to <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}

          <form onSubmit={step === "email" ? handleSendOTP : handleResetPassword} className="space-y-5">
            {step === "email" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@shop.com"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}

            {step === "verify" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-center text-2xl font-mono font-bold text-slate-900 tracking-[0.3em] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step === "email" ? "Sending code..." : "Resetting..."}
                </>
              ) : step === "email" ? (
                "Send Reset Code"
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Remember your password?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Secure multi-tenant management platform
        </p>
      </div>
    </div>
  );
}
