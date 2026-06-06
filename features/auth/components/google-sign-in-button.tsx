"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../store/auth-store";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

export function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      setError("No credential received from Google");
      return;
    }

    try {
      await loginWithGoogle(credentialResponse.credential);
      const user = useAuthStore.getState().user;
      const isAdmin = user?.role === "admin" || user?.role === "super_admin";

      if (onSuccess) {
        onSuccess();
        if (isAdmin) router.push("/admin");
        else if (redirectTo) router.push(redirectTo);
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(isAdmin ? "/admin" : "/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex w-full justify-center [&>div]:w-full! [&_iframe]:w-full!">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError("Google sign-in was cancelled or failed")}
          theme="outline"
          size="large"
          shape="rectangular"
          text="signin_with"
          logo_alignment="center"
          width="360"
        />
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
