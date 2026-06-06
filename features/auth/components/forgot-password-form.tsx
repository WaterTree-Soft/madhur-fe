"use client";

import { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";
import { useAuthStore } from "../store/auth-store";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useAddressStore } from "@/features/account/store/address-store";
import { OtpInput } from "./otp-input";

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onBackToLogin, onSuccess }: ForgotPasswordFormProps = {}) {
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [resetLoading, setResetLoading] = useState(false);

  const handleSendCode = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error ?? "Could not send code");
      }

      setStep("reset");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleReset = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetErrors({});

    if (otp.length !== 6) {
      setResetErrors({ otp: "Please enter the 6-digit code" });
      return;
    }

    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setResetErrors({ password: "Min 8 chars with uppercase, lowercase, and a number" });
      return;
    }

    if (password !== confirmPassword) {
      setResetErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setResetErrors({ form: json?.error ?? "Could not reset password" });
        return;
      }

      const jwt: string = json.data?.jwt;
      const userData = json.data?.user;
      if (jwt && userData) {
        localStorage.setItem("ms-auth", jwt);
        document.cookie = `ms-auth=${jwt}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        const firstName = userData.firstName ?? "";
        const lastName = userData.lastName ?? "";
        setUser({
          id: String(userData.id),
          email: userData.email,
          firstName,
          lastName,
          name: userData.name ?? `${firstName} ${lastName}`.trim(),
          role: userData.role ?? "user",
          createdAt: userData.createdAt,
        });

        useCartStore.getState().hydrateFromServer();
        useAddressStore.getState().hydrateFromServer(String(userData.id));
      }

      onSuccess?.();
    } catch {
      setResetErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setResetLoading(false);
    }
  };

  if (step === "reset") {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground block text-center">
              Verification Code
            </label>
            <OtpInput value={otp} onChange={setOtp} />
            {resetErrors.otp && (
              <p className="text-xs text-destructive text-center">{resetErrors.otp}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="new-password" className="text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
            {resetErrors.password ? (
              <p className="text-xs text-destructive">{resetErrors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Min 8 chars, with uppercase, lowercase, and a number
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-new-password" className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9"
              />
            </div>
            {resetErrors.confirmPassword && (
              <p className="text-xs text-destructive">{resetErrors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={resetLoading}>
            {resetLoading ? "Resetting..." : "Reset Password"}
          </Button>

          {resetErrors.form && (
            <p className="text-sm text-destructive text-center">{resetErrors.form}</p>
          )}
        </form>

        <button
          type="button"
          onClick={onBackToLogin}
          className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSendCode} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
          {emailError && <p className="text-xs text-destructive">{emailError}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={emailLoading}>
          {emailLoading ? "Sending..." : "Send Code"}
        </Button>
      </form>

      <button
        type="button"
        onClick={onBackToLogin}
        className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Sign In
      </button>
    </div>
  );
}
