"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Smartphone, Lock, Shield, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import {
  GlowCard,
  FloatingBlob,
  MaskRevealText,
  StaggeredInput,
  LiquidButton,
  AnimatedGroup,
  AnimatedItem,
} from "@/components/MotionPrimitives";

function AnimatedInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  autoFocus?: boolean;
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-7 pb-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none transition-all duration-300 placeholder-gray-400 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.12)]"
      />
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", email, code, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login?reset=success"), 2000);
      } else {
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row">
      {/* Left Panel */}
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
                  Password Reset
                </p>
              </AnimatedItem>
              <AnimatedItem>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                  <MaskRevealText text="Reset your" delay={0.1} />
                  <br />
                  <MaskRevealText text="password" delay={0.2} />
                </h1>
              </AnimatedItem>
              <AnimatedItem>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed mb-10">
                  Enter the verification code sent to your email and set a new password to regain access to your shop dashboard.
                </p>
              </AnimatedItem>
            </AnimatedGroup>

            <AnimatedGroup className="space-y-4" delay={0.4}>
              {[
                { icon: <Lock className="w-5 h-5" />, text: "Secure OTP verification" },
                { icon: <KeyRound className="w-5 h-5" />, text: "Set a strong new password" },
                { icon: <Shield className="w-5 h-5" />, text: "All data remains protected" },
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
            ← Back to Sign In
          </a>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-[45%] bg-white flex items-center justify-center p-8 sm:p-12 overflow-auto">
        <div className="w-full max-w-[400px]">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <GlowCard className="bg-white border-0 shadow-none p-0">
            <AnimatedGroup className="mb-8">
              <AnimatedItem>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  <MaskRevealText text="Set new password" />
                </h2>
              </AnimatedItem>
              <AnimatedItem>
                <p className="text-sm text-gray-500">
                  Enter the code from your email and choose a new password.
                </p>
              </AnimatedItem>
            </AnimatedGroup>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                >
                  <KeyRound className="w-8 h-8 text-emerald-600" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Password Reset!</h3>
                <p className="text-sm text-gray-500">Redirecting to login...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                <StaggeredInput index={0}>
                  <AnimatedInput
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@shop.com"
                    required
                    autoFocus
                  />
                </StaggeredInput>

                <StaggeredInput index={1}>
                  <AnimatedInput
                    label="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    required
                  />
                </StaggeredInput>

                <StaggeredInput index={2}>
                  <AnimatedInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                  />
                </StaggeredInput>

                <StaggeredInput index={3}>
                  <AnimatedInput
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                </StaggeredInput>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <StaggeredInput index={4}>
                  <LiquidButton
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </LiquidButton>
                </StaggeredInput>
              </form>
            )}

            <p className="text-center text-gray-500 text-sm mt-8">
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 font-semibold hover:underline">
                Log in
              </a>
            </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
