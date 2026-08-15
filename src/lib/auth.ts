import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/db";
import { getAdminEmail, isDatabaseConfigured } from "@/lib/env";

async function promoteAdmin(email?: string | null, userId?: string) {
  if (!email || !isDatabaseConfigured()) {
    return;
  }

  if (email.toLowerCase() !== getAdminEmail()) {
    return;
  }

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
    return;
  }

  await prisma.user.updateMany({
    where: { email },
    data: { role: "ADMIN" },
  });
}

const credentialsProvider = Credentials({
  name: "Email",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!isDatabaseConfigured()) {
      return null;
    }

    const email =
      typeof credentials?.email === "string"
        ? credentials.email.trim().toLowerCase()
        : "";
    const password =
      typeof credentials?.password === "string" ? credentials.password : "";

    if (!email || !password) {
      return null;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      return null;
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
  },
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: isDatabaseConfigured() ? PrismaAdapter(prisma) : undefined,
  providers: [...authConfig.providers, credentialsProvider],
  events: {
    async createUser({ user }) {
      await promoteAdmin(user.email, user.id);
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role === "ADMIN" ? "ADMIN" : "USER";

        if (isDatabaseConfigured() && user.email) {
          await promoteAdmin(user.email, user.id);
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role ?? token.role;
        }
      }

      return token;
    },
  },
});
