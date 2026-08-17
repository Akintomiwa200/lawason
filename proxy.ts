import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";
import { loginHref } from "@/lib/auth-redirect";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const url = req.nextUrl;
  const path = url.pathname;

  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL(loginHref(path), url.origin));
  }

  if (req.auth.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
