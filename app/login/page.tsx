"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailPassword = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { onboarded_with: "email_password" },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage("Check your inbox to confirm your email, then continue.");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handlePhoneOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!otpSent) {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true },
      });
      if (otpError) {
        setError(otpError.message);
      } else {
        setOtpSent(true);
        setMessage("OTP sent via SMS. Enter the code to continue.");
      }
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: otpCode,
      type: "sms",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      await handlePhoneOtp();
    } else {
      await handleEmailPassword();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-200 p-8">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Service Catalog
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {phone
              ? "Use SMS OTP or email/password to continue."
              : "Use email/password or add a phone number for SMS login."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              type="email"
              required={!phone}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              type="password"
              required={!phone}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-3 rounded-lg bg-slate-50 p-4">
            <label className="text-sm font-medium text-slate-700">
              Phone (optional, SMS OTP)
            </label>
            <Input
              type="tel"
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {otpSent && (
              <Input
                type="text"
                placeholder="Enter OTP code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
            )}
            <p className="text-xs text-slate-500">
              Enable SMS auth in Supabase to use phone login.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Working..."
              : phone
                ? otpSent
                  ? "Verify OTP"
                  : "Send OTP"
                : mode === "login"
                  ? "Login"
                  : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {mode === "login" ? "No account yet?" : "Already registered?"}{" "}
          <button
            type="button"
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setMessage(null);
            }}
          >
            {mode === "login" ? "Create one" : "Go to login"}
          </button>
        </div>
      </div>
    </div>
  );
}

