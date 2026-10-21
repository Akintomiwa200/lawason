import { randomBytes, randomInt } from "crypto";
import { compare, hash } from "bcryptjs";

import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

const RESET_TICKET_TTL_MS = 15 * 60 * 1000; // 15 minutes
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const OTP_MAX_ATTEMPTS = 5;

export function generateToken() {
  return randomBytes(32).toString("hex");
}

export function generateOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function resetTicketExpiry() {
  return new Date(Date.now() + RESET_TICKET_TTL_MS);
}

export function verifyTokenExpiry() {
  return new Date(Date.now() + VERIFY_TOKEN_TTL_MS);
}

/**
 * Creates a password reset record and returns the opaque reset ticket plus the
 * 6-digit code to email. The code is hashed; the ticket is stored in plaintext
 * so it can be presented back once verified.
 */
export async function createPasswordResetOtp(userId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const token = generateToken();
  const code = generateOtp();
  const codeHash = await hash(code, 10);

  // Invalidate any outstanding codes for this user.
  await prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      codeHash,
      expires: resetTicketExpiry(),
    },
  });

  return { token, code };
}

/**
 * Validates the emailed 6-digit code against the reset ticket. On success the
 * ticket is marked verified so the password can be changed. Enforces an attempt
 * limit and expiry.
 */
export async function verifyPasswordResetOtp(token: string, code: string) {
  if (!isDatabaseConfigured()) {
    return { ok: false as const, reason: "database" as const };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expires < new Date()) {
    return { ok: false as const, reason: "expired" as const };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false as const, reason: "locked" as const };
  }

  const valid = await compare(code, record.codeHash);

  if (!valid) {
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    const remaining = OTP_MAX_ATTEMPTS - (record.attempts + 1);
    return {
      ok: false as const,
      reason: "invalid" as const,
      remaining: Math.max(remaining, 0),
    };
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { verifiedAt: new Date() },
  });

  return { ok: true as const, user: record.user };
}

/**
 * Consumes a reset ticket that has already passed OTP verification.
 */
export async function consumeVerifiedResetToken(token: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.usedAt || !record.verifiedAt || record.expires < new Date()) {
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
