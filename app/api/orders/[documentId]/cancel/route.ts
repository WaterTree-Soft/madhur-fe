import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

type Params = { params: Promise<{ documentId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { documentId } = await params;
  const body = await request.json().catch(() => ({}));
  return proxyToExpress(request, `/api/orders/${documentId}/cancel`, { body });
}
