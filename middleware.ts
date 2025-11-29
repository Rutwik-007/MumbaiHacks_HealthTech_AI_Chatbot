import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // Allow auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow login and register pages without authentication
  if (["/login", "/register"].includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // Redirect unauthenticated users to login page (no guest mode)
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = (token?.role as string) || "citizen";

  // Role-based route protection
  // Admin users should only access admin routes
  if (userRole === "admin") {
    if (pathname === "/" || pathname.startsWith("/chat") || pathname.startsWith("/asha") || pathname.startsWith("/officer")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  
  // Officer users should only access officer routes
  if (userRole === "officer") {
    if (pathname === "/" || pathname.startsWith("/chat") || pathname.startsWith("/asha") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/officer", request.url));
    }
  }
  
  // ASHA workers should only access asha routes
  if (userRole === "asha") {
    if (pathname === "/" || pathname.startsWith("/chat") || pathname.startsWith("/officer") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/asha", request.url));
    }
  }
  
  // Citizens can only access chat, not admin/officer/asha routes
  if (userRole === "citizen") {
    if (pathname.startsWith("/admin") || pathname.startsWith("/officer") || pathname.startsWith("/asha")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect API routes that require admin access
  if (pathname.startsWith("/api/admin")) {
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/chat/:id",
    "/api/:path*",
    "/login",
    "/register",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
