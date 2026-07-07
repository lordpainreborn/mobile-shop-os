"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabase();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.email) {
        setError(sessionError?.message || "No session found");
        return;
      }

      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email.split("@")[0],
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Account setup failed");
        return;
      }

      router.push("/account");
      router.refresh();
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="max-w-sm text-center p-8">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <a href="/login" className="text-blue-600 hover:underline text-sm">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600 text-sm">Completing sign-in...</p>
      </div>
    </div>
  );
}
