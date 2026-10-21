import { randomBytes } from "crypto";

import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateToken() {
  return randomBytes(32).toString("hex");
}

export function resetTokenExpiry() {
  return new Date(Date.now() + RESET_TOKEN_TTL_MS);
}

export function verifyTokenExpiry() {
  return new Date(Date.now() + VERIFY_TOKEN_TTL_MS);
}

export async function createPasswordResetToken(userId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const token = generateToken();

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expires: resetTokenExpiry(),
    },
  });

  return token;
}

export async function consumePasswordResetToken(token: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expires < new Date()) {
    return null;
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.user;
}

export async function invalidatePasswordResets(userId: string) {
  if (!isDatabaseConfigured()) {
    return;
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId, usedAt: null },
  });
}

export async function createEmailVerificationToken(email: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const normalized = email.trim().toLowerCase();
  const token = generateToken();

  await prisma.verificationToken.deleteMany({ where: { identifier: normalized } });

  await prisma.verificationToken.create({
    data: {
      identifier: normalized,
      token,
      expires: verifyTokenExpiry(),
    },
  });

  return token;
}

export async function consumeEmailVerificationToken(token: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const record = await prisma.verificationToken.findFirst({ where: { token } });

  if (!record || record.expires < new Date()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: record.identifier },
  });

  if (!user) {
    return null;
  }

  await prisma.verificationToken.deleteMany({ where: { token } });
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  return user;
}
