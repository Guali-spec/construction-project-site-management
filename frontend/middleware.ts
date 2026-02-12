import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allowedRoutesForRole, routeKeyFromPath } from "@/lib/role-routing";

const routePathByKey: Record<string, string> = {
  dashboard: "/dashboard",
  projects: "/projects",
  tasks: "/tasks",
  photos: "/photos",
  suivi: "/suivi",
  resources: "/resources",
  finance: "/finance",
  reports: "/reports",
  admin: "/admin",
};

function getDefaultRoute(role?: string | null) {
  if (!role) return "/login";
  if (role === "SUPER_ADMIN" || role === "ADMIN_ENTREPRISE") return "/admin";
  const allowed = allowedRoutesForRole(role as any);
  if (allowed.length === 0) return "/pending";
  const key = allowed[0];
  return routePathByKey[key] ?? "/projects";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register", "/pending", "/forgot-password", "/api"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    if (token && role && (pathname === "/login" || pathname === "/register")) {
      const target = getDefaultRoute(role);
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
    const target = getDefaultRoute(role);
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (pathname === "/") {
    const target = getDefaultRoute(role);
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (role) {
    const routeKey = routeKeyFromPath(pathname);
    if (routeKey) {
      const allowed = allowedRoutesForRole(role as any);
      if (!allowed.includes(routeKey)) {
        const target = getDefaultRoute(role);
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
