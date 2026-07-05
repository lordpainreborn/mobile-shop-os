import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "mshop_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "mobile-shop-os-dev-secret-change-in-production"
);

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/api/auth/login", "/api/auth/logout", "/api/auth/me"];
const LEGAL_PATHS = ["/terms-of-service", "/privacy-policy"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname === "/download" ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    LEGAL_PATHS.some((p) => pathname === p)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    if (pathname.startsWith("/admin") && payload.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
