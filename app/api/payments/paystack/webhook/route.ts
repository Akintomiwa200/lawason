import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

import { markRegistrationPaid } from "@/lib/event-payment";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Paystack is not configured" }, { status: 503 });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(raw).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(raw) as {
    event?: string;
    data?: { reference?: string; status?: string };
  };

  if (payload.event === "charge.success" && payload.data?.reference && payload.data.status === "success") {
    await markRegistrationPaid(payload.data.reference);
  }

  return NextResponse.json({ received: true });
}
