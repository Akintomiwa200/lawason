import { NextResponse } from "next/server";
import { z } from "zod";

import { createPasswordResetToken } from "@/lib/auth-tokens";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { buildActionUrl, isEmailDeliveryConfigured, sendEmail } from "@/lib/mailer";

const schema = z.object({
  email: z.email(),
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
      { error: parsed.error.issues[0]?.message ?? "Enter a valid email" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond OK so we never reveal whether an account exists.
  if (!user?.passwordHash) {
    return NextResponse.json({ ok: true });
  }

  const token = await createPasswordResetToken(user.id);

  if (!token) {
    return NextResponse.json({ ok: true });
  }

  const url = buildActionUrl("/reset-password", token);
  await sendEmail({
    to: email,
    subject: "Reset your GM Lawason password",
    text: `Reset your password using this link (valid for 1 hour): ${url}`,
    url,
  });

  return NextResponse.json({
    ok: true,
    url: isEmailDeliveryConfigured() ? undefined : url,
  });
}
