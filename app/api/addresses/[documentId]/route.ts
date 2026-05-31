import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

type Params = { params: Promise<{ documentId: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { documentId } = await params;
  const body = await request.json();
  return proxyToExpress(request, `/api/addresses/${documentId}`, { body });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { documentId } = await params;
  return proxyToExpress(request, `/api/addresses/${documentId}`);
}
