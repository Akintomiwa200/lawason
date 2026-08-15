import { EventHub } from "@/components/events/event-hub";
import { auth } from "@/lib/auth";
import { getEventCards } from "@/lib/event-queries";
import { asEventTab } from "@/types/events";

export const metadata = {
  title: "Events",
  description: "Register for GM Lawason Studios camps, workshops, and training.",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  const tab = asEventTab(params.tab);
  const events = await getEventCards("all", session?.user?.id);

  return <EventHub initialTab={tab} initialEvents={events} />;
}
