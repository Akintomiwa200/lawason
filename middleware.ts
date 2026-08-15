import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";
import { loginHref, safeReturnPath } from "@/lib/auth-redirect";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const url = req.nextUrl;
  const deprecatedReturn = url.searchParams.get("callbackUrl");

  if (
    (url.pathname === "/login" || url.pathname === "/register") &&
    deprecatedReturn
  ) {
    const clean = url.clone();
    clean.searchParams.delete("callbackUrl");
    clean.searchParams.set("next", safeReturnPath(deprecatedReturn));
    return NextResponse.redirect(clean);
  }

  const path = url.pathname;
  const isAdmin = path.startsWith("/admin");

  if (!isAdmin) {
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
  matcher: ["/admin/:path*", "/login", "/register"],
};
