import { NextRequest } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  const auth = getAuthHeader(request);
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;

  try {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    const d = json.data ?? {};
    // Return a shape compatible with both the old admin page and new Express stats
    return Response.json(
      {
        products: d.totalProducts ?? 0,
        orders: d.totalOrders ?? 0,
        users: d.totalUsers ?? 0,
        revenue: d.totalRevenue ?? 0,
        ...d,
      },
      { status: res.status }
    );
  } catch {
    return Response.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
