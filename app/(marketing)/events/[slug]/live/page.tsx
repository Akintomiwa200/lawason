import { notFound } from "next/navigation";

import { EventLiveRoom } from "@/components/events/event-live-room";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { eventInclude, serializeEventCard } from "@/lib/event-queries";
import { getEventSample } from "@/lib/event-samples";
import { getAppUrl } from "@/lib/paystack";
import { isOnlineEvent } from "@/types/events";

export default async function EventLivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const origin = getAppUrl();

  const sample = getEventSample(slug);
  if (!isDatabaseConfigured()) {
    if (!sample || !isOnlineEvent(sample.format)) {
      notFound();
    }
    return <EventLiveRoom event={sample} canJoin origin={origin} />;
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: eventInclude,
    });
    if (event && event.status !== "DRAFT" && isOnlineEvent(event.format)) {
      const card = serializeEventCard(event, session?.user?.id);
      const registration = session?.user?.id
        ? await prisma.eventRegistration.findFirst({
            where: {
              eventId: event.id,
              userId: session.user.id,
              status: { not: "CANCELLED" },
            },
          })
        : null;
      const paid = !event.requiresPayment || registration?.paymentStatus === "PAID";
      return (
        <EventLiveRoom
          event={card}
          canJoin={Boolean(registration && paid)}
          origin={origin}
        />
      );
    }
  } catch {
    // samples
  }

  if (!sample || !isOnlineEvent(sample.format)) {
    notFound();
  }

  return <EventLiveRoom event={sample} canJoin origin={origin} />;
}
