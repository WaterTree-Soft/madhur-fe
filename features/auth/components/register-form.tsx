"use client";

import { useState } from "react";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/auth-store";
import { registerSchema } from "../schema/auth-schema";
import { API_URL } from "@/lib/constants";
import { GoogleSignInButton } from "./google-sign-in-button";
import { OtpInput } from "./otp-input";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}

export function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps = {}) {
  const register = useAuthStore((s) => s.register);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "otp">("form");

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ firstName, lastName, email, password, confirmPassword });

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
      await register({ firstName, lastName, email, password, confirmPassword });
      setStep("otp");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Registration failed. Please try again." });
    }
  };

  const handleVerify = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");

    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }

    setVerifying(true);
    try {
      await verifyOtp(email, otp);
      onSuccess?.();
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
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
      setResendMessage("New code sent. Check your inbox.");
    } catch {
      setResendMessage("Could not resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <OtpInput value={otp} onChange={setOtp} />

          <Button type="submit" className="w-full" disabled={verifying || otp.length !== 6}>
            {verifying ? "Verifying..." : "Verify"}
          </Button>

          {otpError && <p className="text-sm text-destructive text-center">{otpError}</p>}
        </form>

        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend"}
            </button>
          </p>
          {resendMessage && <p>{resendMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-card px-3 text-muted-foreground">Or with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-9"
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

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
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Min 8 chars, with uppercase, lowercase, and a number
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        {errors.form && <p className="text-sm text-destructive text-center">{errors.form}</p>}
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
