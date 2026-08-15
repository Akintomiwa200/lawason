"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { EventCard } from "@/components/events/event-card";
import { EventPreview } from "@/components/events/event-preview";
import { useEventLive } from "@/hooks/use-event-live";
import { cn } from "@/lib/utils";
import { eventMatchesTab, type EventCardPayload, type EventTab } from "@/types/events";

const tabs: { id: EventTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
  { id: "open", label: "Open" },
];

export function EventHub({
  initialTab,
  initialEvents,
}: {
  initialTab: EventTab;
  initialEvents: EventCardPayload[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<EventTab>(initialTab);
  const [events, setEvents] = useState(initialEvents);
  const [selectedId, setSelectedId] = useState(initialEvents[0]?.id ?? null);

  const visibleEvents = useMemo(
    () => events.filter((event) => eventMatchesTab(event, tab)),
    [events, tab],
  );

  const selected =
    visibleEvents.find((event) => event.id === selectedId) ?? visibleEvents[0] ?? null;

  useEffect(() => {
    if (!visibleEvents.some((event) => event.id === selectedId)) {
      setSelectedId(visibleEvents[0]?.id ?? null);
    }
  }, [selectedId, visibleEvents]);

  useEventLive((live) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === live.eventId
          ? {
              ...event,
              goingCount: live.goingCount,
              interestedCount: live.interestedCount,
              attendees: live.attendees,
            }
          : event,
      ),
    );
  });

  function selectTab(next: EventTab) {
    setTab(next);
    const query = next === "all" ? pathname : `${pathname}?tab=${next}`;
    router.replace(query, { scroll: false });
  }

  const emptyCopy =
    tab === "free"
      ? "No free programmes in this list."
      : tab === "paid"
        ? "No paid programmes in this list."
        : tab === "open"
          ? "No programmes are open for enrollment."
          : "No programmes yet.";

  return (
    <div className="min-h-screen bg-background pb-16 pt-24">
      <div className="mx-auto w-full max-w-[90rem] px-4 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
            <EventPreview event={selected} />
          </div>

          <section className="order-1 lg:order-2">
            <div
              role="tablist"
              aria-label="Filter programmes"
              className="mb-8 grid grid-cols-4 border-b border-border"
            >
              {tabs.map((item) => {
                const count = events.filter((event) => eventMatchesTab(event, item.id)).length;
                const active = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectTab(item.id)}
                    className={cn(
                      "relative py-3 text-center text-sm font-medium transition",
                      active ? "text-foreground" : "text-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <span className="ml-1.5 text-xs text-muted">{count}</span>
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {visibleEvents.length === 0 ? (
              <p className="rounded-3xl border border-border bg-surface p-8 text-sm text-muted">
                {emptyCopy}
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    selected={event.id === selected?.id}
                    onSelect={(next) => setSelectedId(next.id)}
                    onInterest={(eventId, interested) => {
                      setEvents((current) =>
                        current.map((item) =>
                          item.id === eventId
                            ? {
                                ...item,
                                interested,
                                interestedCount: Math.max(
                                  0,
                                  item.interestedCount + (interested ? 1 : -1),
                                ),
                              }
                            : item,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
