import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  return proxyToExpress(request, "/api/orders/my");
}
