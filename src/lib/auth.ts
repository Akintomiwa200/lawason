import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { isGoogleAuthConfigured } from "@/lib/auth-env";

const providers = isGoogleAuthConfigured()
  ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ]
  : [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
