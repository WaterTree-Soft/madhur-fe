import { NextRequest } from "next/server";
import { API_URL } from "@/lib/constants";

export interface ExpressUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  avatar?: string;
}

/**
 * Resolves the caller's Express user from the Authorization header JWT.
 * Returns `null` if the header is missing or the token is invalid.
 */
export async function resolveUser(
  request: NextRequest
): Promise<ExpressUser | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: authHeader },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data ?? null) as ExpressUser | null;
}
