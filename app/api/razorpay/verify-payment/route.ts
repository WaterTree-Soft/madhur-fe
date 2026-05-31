import { NextRequest } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const auth = getAuthHeader(request);
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (auth) headers["Authorization"] = auth;

    const res = await fetch(`${API_URL}/api/razorpay/verify-payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    return Response.json(json.data ?? json, { status: res.status });
  } catch (err) {
    console.error("Razorpay verify-payment proxy error:", err);
    return Response.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
