import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { getAppUrl, initializePaystack, isPaystackConfigured } from "@/lib/paystack";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }
  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: "Paystack is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { eventSlug?: string; email?: string };
  const eventSlug = body.eventSlug?.trim();
  const email = body.email?.trim().toLowerCase();
  if (!eventSlug || !email) {
    return NextResponse.json({ error: "Event and email are required" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event || !event.requiresPayment || event.priceAmount == null) {
    return NextResponse.json({ error: "This programme does not take Paystack payment" }, { status: 400 });
  }

  const registration = await prisma.eventRegistration.findFirst({
    where: {
      eventId: event.id,
      email,
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!registration) {
    return NextResponse.json({ error: "Register first, then pay" }, { status: 404 });
  }

  if (registration.paymentStatus === "PAID") {
    return NextResponse.json({ alreadyPaid: true, url: `/events/${event.slug}/live` });
  }

  const reference = `gml-${registration.id}-${Date.now()}`;
  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: { paymentReference: reference, paymentProvider: "PAYSTACK" },
  });

  const checkout = await initializePaystack({
    email,
    amount: event.priceAmount,
    currency: event.currency,
    reference,
    callbackUrl: `${getAppUrl()}/api/payments/paystack/callback`,
    metadata: {
      eventSlug: event.slug,
      registrationId: registration.id,
    },
  });

  return NextResponse.json({ url: checkout.authorization_url, reference: checkout.reference });
}
