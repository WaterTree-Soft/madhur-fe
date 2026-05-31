import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToExpress(request, `/api/admin/users/${id}/revoke-admin`);
}
