import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allowedRoutesForRole, routeKeyFromPath } from "@/lib/role-routing";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register", "/pending", "/forgot-password", "/api"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    if (token && role && (pathname === "/login" || pathname === "/register")) {
      const target = role === "SUPER_ADMIN" || role === "ADMIN_ENTREPRISE" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }

    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (role === "PENDING" && !pathname.startsWith("/pending")) {
    const pendingUrl = new URL("/pending", request.url);
    return NextResponse.redirect(pendingUrl);
  }

  if (role && role !== "PENDING" && pathname.startsWith("/pending")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname === "/") {
    const target = role === "SUPER_ADMIN" || role === "ADMIN_ENTREPRISE" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (role) {
    const routeKey = routeKeyFromPath(pathname);
    if (routeKey) {
      const allowed = allowedRoutesForRole(role as any);
      if (!allowed.includes(routeKey)) {
        const target = role === "SUPER_ADMIN" || role === "ADMIN_ENTREPRISE" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
