"use client";

import { useEffect, useRef, useState } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.max(200, Math.min(400, el.offsetWidth));
      setWidth(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      <div ref={containerRef} className="w-full overflow-hidden">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError("Google sign-in was cancelled or failed")}
          theme="outline"
          size="large"
          shape="rectangular"
          text="signin_with"
          logo_alignment="center"
          width={width.toString()}
        />
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
