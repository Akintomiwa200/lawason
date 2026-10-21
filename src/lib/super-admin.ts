import { timingSafeEqual } from "node:crypto";

import {
  getSuperAdminEmail,
  getSuperAdminPassword,
  getSuperAdminUsername,
} from "@/lib/env";

export interface SuperAdminIdentity {
  id: string;
  username: string;
  email: string;
}

/**
 * Verifies a username/password pair against the built-in super-admin
 * credentials. Comparison is constant-time to avoid leaking length/prefix
 * information via timing.
 */
export function verifySuperAdmin(
  username?: string | null,
  password?: string | null,
): SuperAdminIdentity | null {
  if (typeof username !== "string" || typeof password !== "string") {
    return null;
  }

  const expectedUser = getSuperAdminUsername();
  const expectedPass = getSuperAdminPassword();

  const userMatches = safeEqual(username.trim().toLowerCase(), expectedUser.toLowerCase());
  const passMatches = safeEqual(password, expectedPass);

  if (!userMatches || !passMatches) {
    return null;
  }

  return {
    id: "super-admin",
    username: expectedUser,
    email: getSuperAdminEmail(),
  };
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) {
    // Still run a comparison against a same-length buffer to keep timing flat.
    const padded = Buffer.alloc(bufferA.length);
    timingSafeEqual(bufferA, padded);
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}
