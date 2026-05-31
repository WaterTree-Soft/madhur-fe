import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface ProxyOptions {
  body?: unknown;
}

function getAuthHeader(request: NextRequest): string | null {
  const header = request.headers.get("Authorization");
  if (header) return header;
  const cookieJwt = request.cookies.get("ms-auth")?.value;
  return cookieJwt ? `Bearer ${cookieJwt}` : null;
}

/**
 * Forwards a Next.js API route request to the Express backend.
 * Reads auth from Authorization header first, then falls back to ms-auth cookie
 * (so admin components that don't set headers still authenticate via cookie).
 */
export async function proxyToExpress(
  request: NextRequest,
  path: string,
  options: ProxyOptions = {}
): Promise<Response> {
  const qs = request.nextUrl.searchParams.toString();
  const url = `${API_URL}${path}${qs ? `?${qs}` : ""}`;

  const auth = getAuthHeader(request);
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;

  const fetchOptions: RequestInit = { method: request.method, headers };
  if (options.body !== undefined) fetchOptions.body = JSON.stringify(options.body);

  try {
    const res = await fetch(url, fetchOptions);
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

export { API_URL, getAuthHeader };
