import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { consumeVerifiedResetToken } from "@/lib/auth-tokens";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

const schema = z.object({
  ticket: z.string().min(1),
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
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const user = await consumeVerifiedResetToken(parsed.data.ticket);

  if (!user) {
    return NextResponse.json(
      { error: "Your verification session has expired. Please start again." },
      { status: 400 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
