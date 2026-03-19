// C:\Users\laloo\job-progress-tracker\middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Paths where middleware will run
export const config = {
  matcher: ["/(dashboard)/:path*"], // Apply to all dashboard routes
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get token from cookies (replace 'token' with your JWT cookie name)
  const token = req.cookies.get("token")?.value;

  // If no token, redirect to login page
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Optional: You can decode the JWT to check role if you want
  // Example: block workers from employer pages
  const pathname = req.nextUrl.pathname;

  // Example: restrict access
  if (pathname.startsWith("/dashboard/employer") && token === "worker") {
    url.pathname = "/unauthorized"; // Or redirect to worker dashboard
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard/worker") && token === "employer") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // If all checks pass, continue
  return NextResponse.next();
}