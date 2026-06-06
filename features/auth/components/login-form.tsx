"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/auth-store";
import { loginSchema } from "../schema/auth-schema";
import { API_URL } from "@/lib/constants";
import { GoogleSignInButton } from "./google-sign-in-button";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword }: LoginFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setUnverified(false);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await login({ email, password });
      setSuccess(true);

      const user = useAuthStore.getState().user;
      const isAdmin = user?.role === "admin" || user?.role === "super_admin";
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
          if (isAdmin) router.push("/admin");
          else if (redirectTo) router.push(redirectTo);
        } else if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push(isAdmin ? "/admin" : "/");
        }
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      if (message.toLowerCase().includes("verify your email")) {
        setUnverified(true);
      } else {
        setErrors({ email: message });
      }
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendMessage("Verification email sent. Check your inbox.");
    } catch {
      setResendMessage("Could not resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <GoogleSignInButton onSuccess={onSuccess} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-card px-3 text-muted-foreground">Or with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
            Login successful! Redirecting...
          </div>
        )}

        {unverified && (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 space-y-2">
            <p className="font-medium">Please verify your email to continue.</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-amber-700 underline underline-offset-4 hover:text-amber-900 disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend verification email"}
            </button>
            {resendMessage && <p className="text-xs text-amber-700">{resendMessage}</p>}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
          {onForgotPassword && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || success}>
          {isLoading ? "Signing in..." : success ? "Redirecting..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </button>
        ) : (
          <Link
            href={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        )}
      </p>
    </div>
  );
}
