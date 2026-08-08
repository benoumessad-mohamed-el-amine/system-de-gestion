import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { hasPermission, ROUTE_PERMISSIONS } from "@/lib/permissions";
import type { Permission, UserRole } from "@/types";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
];

function applySecurityHeaders(response: NextResponse) {
  response.headers.set(
    "X-Content-Type-Options",
    "nosniff"
  );
  response.headers.set(
    "X-Frame-Options",
    "DENY"
  );
  response.headers.set(
    "X-XSS-Protection",
    "1; mode=block"
  );
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  return response;
}

function getBaseUrl(req: Parameters<Parameters<typeof auth>[0]>[0]) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return req.nextUrl.origin;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const baseUrl = getBaseUrl(req);

  const isPublic = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // Public routes
  if (isPublic) {
    if (pathname === "/login" && req.auth?.user) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/dashboard", baseUrl))
      );
    }

    return applySecurityHeaders(NextResponse.next());
  }

  // Not authenticated
  if (!req.auth?.user) {
    const loginUrl = new URL("/login", baseUrl);

    if (pathname !== "/login") {
      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );
    }

    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Permission checking
  const matchedRoute = Object.keys(
    ROUTE_PERMISSIONS
  ).find((route) => pathname.startsWith(route));

  if (matchedRoute) {
    const permission =
      ROUTE_PERMISSIONS[matchedRoute] as Permission;

    const role =
      req.auth.user.role as UserRole;

    // Uses role-based permissions only
    if (!hasPermission(role, permission)) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/dashboard", baseUrl))
      );
    }
  }

  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|firebase-messaging-sw.js).*)",
  ],
};
