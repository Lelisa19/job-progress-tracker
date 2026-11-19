import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";


export const config = {
  matcher: ["/employer/:path*", "/worker/:path*"],
};

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    return null;
  }
  return new TextEncoder().encode(s);
}

export default async function middleware(request: NextRequest) {
  const secret = getSecret();
  const token = request.cookies.get("token")?.value;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  if (!secret) {
    console.warn(
      "[middleware] JWT_SECRET missing or too short — set a 32+ char secret in .env.local"
    );
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string | undefined;
    const path = request.nextUrl.pathname;

    if (path.startsWith("/employer") && role !== "employer") {
      return NextResponse.redirect(new URL("/worker/dashboard", request.url));
    }
    if (path.startsWith("/worker") && role !== "worker") {
      return NextResponse.redirect(new URL("/employer/dashboard", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
