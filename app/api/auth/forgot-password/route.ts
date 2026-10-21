import { NextResponse } from "next/server";
import { z } from "zod";

import { createPasswordResetOtp } from "@/lib/auth-tokens";
import { prisma } from "@/lib/db";
import { passwordResetCodeEmail } from "@/lib/email";
import { isDatabaseConfigured } from "@/lib/env";
import { isEmailDeliveryConfigured, sendEmail } from "@/lib/mailer";

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

  const otp = await createPasswordResetOtp(user.id);

  if (!otp) {
    return NextResponse.json({ ok: true });
  }

  const message = passwordResetCodeEmail(otp.code);
  const { delivered } = await sendEmail({ to: email, ...message });

  return NextResponse.json({
    ok: true,
    token: otp.token,
    // Only surface the code when email delivery is unavailable (development).
    devCode: delivered ? undefined : otp.code,
    emailDelivery: isEmailDeliveryConfigured(),
  });
}
