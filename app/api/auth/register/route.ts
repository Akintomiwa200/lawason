import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getAdminEmail, isDatabaseConfigured } from "@/lib/env";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured yet" },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid details" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const isAdmin = email === getAdminEmail();

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: isAdmin ? "ADMIN" : "USER",
    },
  });

  return NextResponse.json({ ok: true });
}
