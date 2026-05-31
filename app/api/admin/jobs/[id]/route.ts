import { NextRequest } from "next/server";
import { proxyToExpress } from "@/lib/proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToExpress(request, `/api/admin/jobs/${id}`);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  return proxyToExpress(request, `/api/admin/jobs/${id}`, { body });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToExpress(request, `/api/admin/jobs/${id}`);
}
