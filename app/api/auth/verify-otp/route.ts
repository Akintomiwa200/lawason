import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPasswordResetOtp } from "@/lib/auth-tokens";
import { isDatabaseConfigured } from "@/lib/env";

const schema = z.object({
  token: z.string().min(1),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
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
      { error: parsed.error.issues[0]?.message ?? "Invalid code" },
      { status: 400 },
    );
  }

  const result = await verifyPasswordResetOtp(parsed.data.token, parsed.data.code);

  if (!result.ok) {
    const messages: Record<string, string> = {
      expired: "This code has expired. Request a new one.",
      locked: "Too many incorrect attempts. Request a new code.",
      database: "Database is not configured yet",
      invalid:
        result.remaining !== undefined
          ? `Incorrect code. ${result.remaining} attempt${
              result.remaining === 1 ? "" : "s"
            } remaining.`
          : "Incorrect code.",
    };

    return NextResponse.json(
      { error: messages[result.reason] ?? "Invalid code" },
      { status: result.reason === "database" ? 503 : 400 },
    );
  }

  return NextResponse.json({ ok: true, ticket: parsed.data.token });
}
