import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLocalHostname, parseHostname } from "@/lib/config";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/favicon.ico") {
    return NextResponse.redirect(new URL("/icon", request.url));
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/health" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const rawHost =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    request.nextUrl.hostname;

  const { hostname, isShopHost } = parseHostname(rawHost);
  const local = isLocalHostname(hostname);

  if (!local && !isShopHost) {
    const url = request.nextUrl.clone();
    url.hostname = `shop.${hostname}`;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-website-host", hostname);
  requestHeaders.set("x-shop-host", "1");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
