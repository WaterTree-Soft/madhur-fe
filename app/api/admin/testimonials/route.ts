import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { proxyToExpress } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  return proxyToExpress(request, "/api/admin/testimonials");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await proxyToExpress(request, "/api/admin/testimonials", { body });
  if (res.status === 201) revalidateTag("testimonials", { expire: 0 });
  return res;
}
