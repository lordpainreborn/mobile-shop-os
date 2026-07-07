import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "mshop_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "mobile-shop-os-dev-secret-change-in-production"
);

const PUBLIC_PATHS = [
  "/login", "/signup", "/forgot-password", "/reset-password",
  "/download", "/terms-of-service", "/privacy-policy",
  "/api/auth", "/api/webhook", "/api/bot",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let isValid = false;

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isApiCall = pathname.startsWith("/api/");
  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p) || pathname === p);

  if (isValid && isAuthPage) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (isValid || isPublic) {
    return NextResponse.next();
  }

  if (isApiCall) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
