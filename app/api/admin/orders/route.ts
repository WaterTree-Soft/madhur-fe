import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  return proxyToExpress(request, "/api/admin/orders");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToExpress(request, "/api/admin/orders", { body });
}
