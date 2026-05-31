import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToExpress(request, `/api/admin/feedback/${id}`);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToExpress(request, `/api/admin/feedback/${id}`);
}

