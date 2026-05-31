"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/auth-store";
import { loginSchema } from "../schema/auth-schema";

interface LoginFormProps {
  /** Called after a successful login. When provided, the form will NOT navigate itself. */
  onSuccess?: () => void;
  /** Optional handler for the "Register" link. When provided, renders a button instead of a link. */
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          fieldErrors[key] = issue.message;
        }
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
      setErrors({
        email: err instanceof Error ? err.message : "Login failed. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
          Login successful! Redirecting...
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || success}>
        {isLoading ? "Signing in..." : success ? "Redirecting..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up now
          </button>
        ) : (
          <Link
            href={
              redirectTo
                ? `/register?redirect=${encodeURIComponent(redirectTo)}`
                : "/register"
            }
            className="text-primary underline-offset-4 hover:underline"
          >
            Register
          </Link>
        )}
      </p>
    </form>
  );
}
