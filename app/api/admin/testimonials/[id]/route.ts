import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { proxyToExpress } from "@/lib/proxy";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToExpress(request, `/api/admin/testimonials/${id}`);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const res = await proxyToExpress(request, `/api/admin/testimonials/${id}`, { body });
  revalidateTag("testimonials", { expire: 0 });
  return res;
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const res = await proxyToExpress(request, `/api/admin/testimonials/${id}`);
  revalidateTag("testimonials", { expire: 0 });
  return res;
}
