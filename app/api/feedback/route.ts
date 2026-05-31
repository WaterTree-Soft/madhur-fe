import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";
import { API_URL, getAuthHeader } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  // Map legacy `productId` param to Express `product` param
  const productId = searchParams.get("productId");
  if (!productId) {
    return Response.json(
      { error: "productId query param is required" },
      { status: 400 }
    );
  }

  const auth = getAuthHeader(request);
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = auth;

  try {
    const res = await fetch(
      `${API_URL}/api/feedback?product=${encodeURIComponent(productId)}`,
      { headers }
    );
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToExpress(request, "/api/feedback", { body });
}
