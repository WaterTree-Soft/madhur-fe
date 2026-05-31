"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth-store";

/** Rehydrates the auth session from localStorage on app load. Renders nothing. */
export function AuthInitializer() {
  const rehydrate = useAuthStore((s) => s.rehydrate);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  return null;
}
