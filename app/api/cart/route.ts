import { NextRequest } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  const auth = getAuthHeader(request);
  if (!auth) return Response.json({ items: [] });

  try {
    const res = await fetch(`${API_URL}/api/cart`, {
      headers: { Authorization: auth },
    });
    if (!res.ok) return Response.json({ items: [] });
    const json = await res.json();
    return Response.json({ items: json.data?.items ?? [] });
  } catch {
    return Response.json({ items: [] });
  }
}

export async function PUT(request: NextRequest) {
  const auth = getAuthHeader(request);
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  try {
    const res = await fetch(`${API_URL}/api/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    return Response.json(
      { items: json.data?.items ?? body.items ?? [] },
      { status: res.status }
    );
  } catch {
    return Response.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
