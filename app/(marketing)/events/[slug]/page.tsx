import { notFound } from "next/navigation";

import { EventDetailView } from "@/components/events/event-detail-view";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { eventInclude, serializeEventCard } from "@/lib/event-queries";
import { getEventSample } from "@/lib/event-samples";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!isDatabaseConfigured()) {
    const sample = getEventSample(slug);
    if (!sample) {
      notFound();
    }
    return (
      <EventDetailView
        event={sample}
        signedIn={Boolean(session?.user?.id)}
        defaultName={session?.user?.name ?? undefined}
        defaultEmail={session?.user?.email ?? undefined}
      />
    );
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: eventInclude,
    });

    if (event && event.status !== "DRAFT") {
      return (
        <EventDetailView
          event={serializeEventCard(event, session?.user?.id)}
          signedIn={Boolean(session?.user?.id)}
          defaultName={session?.user?.name ?? undefined}
          defaultEmail={session?.user?.email ?? undefined}
        />
      );
    }
  } catch {
    // fall through to samples
  }

  const sample = getEventSample(slug);
  if (!sample) {
    notFound();
  }

  return (
    <EventDetailView
      event={sample}
      signedIn={Boolean(session?.user?.id)}
      defaultName={session?.user?.name ?? undefined}
      defaultEmail={session?.user?.email ?? undefined}
    />
  );
}
