import { NextRequest } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = getAuthHeader(request);
  const headers: HeadersInit = {};
  if (auth) headers["Authorization"] = auth;

  try {
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "Upload failed" }, { status: 502 });
  }
}
