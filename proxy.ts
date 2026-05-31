import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const jwt =
      request.cookies.get("ms-auth")?.value ??
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!jwt) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!meRes.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const json = await meRes.json();
      const role: string = json.data?.role ?? json.role ?? "";

      if (role !== "admin" && role !== "super_admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
