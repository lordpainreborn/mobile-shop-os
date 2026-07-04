"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, Info, Smartphone, Lock, Shield, KeyRound } from "lucide-react";
import { sendResetOTP, verifyResetOTP } from "@/actions/forgotPasswordActions";
import { useLanguage } from "@/context/LanguageContext";

type Step = "email" | "verify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fallbackCode, setFallbackCode] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFallbackCode(null);
    setLoading(true);

    try {
      const result = await sendResetOTP({ email });
      if (result.success) {
        setStep("verify");
        if (result.fallbackCode) {
          setFallbackCode(result.fallbackCode);
        }
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

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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
              {language === "en" ? "Account Recovery" : "အကောင့်ပြန်လည်ရယူခြင်း"}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              {language === "en" ? (
                <>Reset your<br />password</>
              ) : (
                <>စကားဝှက်<br />ပြန်လည်သတ်မှတ်ရန်</>
              )}
            </h1>
            <p className="text-blue-100 text-base lg:text-lg leading-relaxed mb-10">
              {language === "en"
                ? "No worries — we'll send you a verification code to reset your password and get you back into your shop dashboard."
                : "စိတ်မပူပါနဲ့ — သင့်စကားဝှက်ကို ပြန်လည်သတ်မှတ်ရန် verification code ပို့ပေးပါမည်။"}
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: <Lock className="w-5 h-5" />, text: language === "en" ? "Secure OTP verification via email" : "Email ဖြင့် လုံခြုံသည့် OTP စစ်ဆေးခြင်း" },
                { icon: <KeyRound className="w-5 h-5" />, text: language === "en" ? "Set a new password instantly" : "စကားဝှက်အသစ် ချက်ချင်းသတ်မှတ်ရန်" },
                { icon: <Shield className="w-5 h-5" />, text: language === "en" ? "All data remains protected" : "ဒေတာအားလုံး လုံခြုံဆဲ" },
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
            {language === "en" ? "← Back to Sign In" : "← ပြန်၀င်ရန်"}
          </a>
        </div>
      </div>

      {/* Right Panel — White Form */}
      <div className="lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-12 overflow-auto">
        <div className="w-full max-w-[400px]">
          {/* Back button for verify step */}
          {step === "verify" && (
            <button
              onClick={() => { setStep("email"); setError(""); setCode(""); setNewPassword(""); setConfirmPassword(""); setFallbackCode(null); }}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "en" ? "Back to email" : "နောက်သို့"}
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {step === "email"
              ? (language === "en" ? "Forgot password?" : "စကားဝှက်မေ့နေပါသလား?")
              : (language === "en" ? "Set new password" : "စကားဝှက်အသစ် သတ်မှတ်ရန်")}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {step === "email"
              ? (language === "en" ? "Enter your email and we'll send you a reset code." : "သင့် Email ထည့်ပါ၊ reset code ပို့ပေးပါမည်။")
              : (language === "en" ? "Enter the code and your new password below." : "ကုဒ်နှင့် စကားဝှက်အသစ် ထည့်ပါ။")}
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

          <form onSubmit={step === "email" ? handleSendOTP : handleResetPassword} className="space-y-5">
            {step === "email" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{language === "en" ? "Email address" : "Email လိပ်စာ"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@shop.com"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                />
              </div>
            )}

            {step === "verify" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{language === "en" ? "Verification Code" : "အတည်ပြုကုဒ်"}</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{language === "en" ? "New Password" : "စကားဝှက်အသစ်"}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{language === "en" ? "Confirm New Password" : "စကားဝှက်အသစ် အတည်ပြုရန်"}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>
              </>
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
                  {step === "email"
                    ? (language === "en" ? "Sending code..." : "ကုဒ်ပို့နေသည်...")
                    : (language === "en" ? "Resetting..." : "ပြန်လည်သတ်မှတ်နေသည်...")}
                </>
              ) : step === "email" ? (
                language === "en" ? "Send Reset Code" : "Reset Code ပို့ရန်"
              ) : (
                language === "en" ? "Reset Password" : "စကားဝှက်ပြောင်းရန်"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            {language === "en" ? "Remember your password?" : "စကားဝှက် မှတ်မိပါသလား?"}{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              {language === "en" ? "Log in" : "ဝင်ရန်"}
            </a>
          </p>

          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => language === "my" && toggleLanguage()}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                language === "en"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => language === "en" && toggleLanguage()}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                language === "my"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              မြန်မာ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
