import { NextResponse } from "next/server";
import { z } from "zod";

import { createEmailVerificationToken } from "@/lib/auth-tokens";
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

  // Do not reveal account existence or verification state.
  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true });
  }

  const token = await createEmailVerificationToken(email);

  if (!token) {
    return NextResponse.json({ ok: true });
  }

  const url = buildActionUrl("/verify-email", token, email);
  await sendEmail({
    to: email,
    subject: "Verify your GM Lawason email",
    text: `Confirm your email using this link (valid for 24 hours): ${url}`,
    url,
  });

  return NextResponse.json({
    ok: true,
    url: isEmailDeliveryConfigured() ? undefined : url,
  });
}
