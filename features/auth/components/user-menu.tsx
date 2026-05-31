"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "../store/auth-store";
import { getAvatarGradient, getInitials } from "@/lib/avatar";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

type DialogView = "login" | "register";

export function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loginDialogOpen = useAuthStore((s) => s.loginDialogOpen);
  const openLoginDialog = useAuthStore((s) => s.openLoginDialog);
  const closeLoginDialog = useAuthStore((s) => s.closeLoginDialog);

  const [view, setView] = useState<DialogView>("login");

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
      return;
    }
    setView("login");
    openLoginDialog();
  };

  const handleSuccess = () => {
    closeLoginDialog();
  };

  const initials = user?.name ? getInitials(user.name) : null;
  const avatarGradient = user?.name ? getAvatarGradient(user.name) : undefined;

  return (
    <>
      <button
        type="button"
        onClick={handleAvatarClick}
        aria-label={isAuthenticated ? "Go to profile" : "Sign in"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={isAuthenticated && initials && !user?.avatar ? { background: avatarGradient, border: "none" } : undefined}
      >
        {isAuthenticated && user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : isAuthenticated && initials ? (
          <span className="text-xs font-semibold text-white">{initials}</span>
        ) : (
          <User className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <Dialog open={loginDialogOpen} onOpenChange={(o) => !o && closeLoginDialog()}>
        <DialogContent>
          {view === "login" ? (
            <>
              <DialogHeader>
                <DialogTitle>Welcome back</DialogTitle>
                <DialogDescription>
                  Sign in to your account to continue.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <LoginForm
                  onSuccess={handleSuccess}
                  onSwitchToRegister={() => setView("register")}
                />
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Create an account</DialogTitle>
                <DialogDescription>
                  Sign up to start ordering your favorite sweets.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <RegisterForm
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => setView("login")}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
