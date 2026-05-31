import { NextRequest } from "next/server";
import { API_URL } from "@/lib/constants";

/**
 * GET /api/auth/me
 * Proxies the request to the Express backend's /api/auth/me endpoint.
 * The client sends its JWT in the Authorization header.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({ error: "No token" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: authHeader },
  });

  const data = await res.json().catch(() => ({}));
  return Response.json(data, { status: res.status });
}
