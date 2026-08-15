import { NextResponse } from "next/server";

import { markRegistrationPaid } from "@/lib/event-payment";
import { getAppUrl, verifyPaystack } from "@/lib/paystack";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const appUrl = getAppUrl();

  if (!reference) {
    return NextResponse.redirect(`${appUrl}/events`);
  }

  try {
    const verified = await verifyPaystack(reference);
    if (verified.status === "success") {
      const paid = await markRegistrationPaid(reference);
      const slug = paid?.slug || verified.metadata?.eventSlug;
      if (slug) {
        return NextResponse.redirect(`${appUrl}/events/${slug}/live?paid=1`);
      }
    }
  } catch {
    // fall through
  }

  return NextResponse.redirect(`${appUrl}/events?payment=failed`);
}
