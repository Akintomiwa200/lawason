import { NextResponse } from "next/server";

import { buildIcs } from "@/lib/calendar";
import { auth } from "@/lib/auth";
import { getEventCards } from "@/lib/event-queries";
import { getEventSample } from "@/lib/event-samples";
import { getAppUrl } from "@/lib/paystack";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  const events = await getEventCards("all", session?.user?.id);
  const event =
    events.find((item) => item.slug === id || item.id === id) ?? getEventSample(id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const ics = buildIcs(event, getAppUrl());
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
