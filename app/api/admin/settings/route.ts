import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  return proxyToExpress(request, "/api/admin/settings");
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return proxyToExpress(request, "/api/admin/settings", { body });
}
