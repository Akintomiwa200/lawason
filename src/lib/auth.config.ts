import type { NextAuthConfig } from "next-auth";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";

import { isAppleAuthConfigured, isGoogleAuthConfigured } from "@/lib/env";

const providers: NextAuthConfig["providers"] = [];

if (isGoogleAuthConfigured()) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

if (isAppleAuthConfigured()) {
  providers.push(
    Apple({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const authConfig = {
  providers,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
