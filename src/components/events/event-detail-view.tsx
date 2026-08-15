"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";

import { EventCalendarActions } from "@/components/events/event-calendar-actions";
import { EventRegisterForm } from "@/components/events/event-register-form";
import { useEventLive } from "@/hooks/use-event-live";
import { eventPageCopy } from "@/lib/event-copy";
import { eventFormatLabel, formatEventPrice, isOnlineEvent, type EventCardPayload } from "@/types/events";

function formatRange(start: string, end?: string | null) {
  const from = new Date(start).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!end) {
    return from;
  }
  const to = new Date(end).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return from === to ? from : `${from} – ${to}`;
}

export function EventDetailView({
  event: initialEvent,
  signedIn,
  defaultName,
  defaultEmail,
}: {
  event: EventCardPayload;
  signedIn: boolean;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [event, setEvent] = useState(initialEvent);
  const canRegister = event.status === "OPEN";
  const copy = eventPageCopy(event);
  const spots =
    event.capacity != null ? Math.max(event.capacity - event.goingCount, 0) : null;

  useEventLive((live) => {
    if (live.eventId !== event.id) {
      return;
    }
    setEvent((current) => ({
      ...current,
      goingCount: live.goingCount,
      interestedCount: live.interestedCount,
      attendees: live.attendees,
    }));
  });

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All programmes
        </Link>

        <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-border bg-surface">
          <div className="relative h-64 bg-surface-elevated md:h-80">
            {event.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,var(--spotlight),transparent_65%)]" />
            )}
            <span className="absolute left-5 top-5 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              {event.category}
            </span>
          </div>
          <div className="space-y-4 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {canRegister ? "Open enrollment" : "Enrollment closed"} · {eventFormatLabel(event.format)}
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {event.title}
            </h1>
            <p className="text-sm text-muted">By {event.organizer}</p>
            <div className="grid gap-4 text-sm sm:grid-cols-3">
              <p className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{formatRange(event.startDate, event.endDate)}</span>
              </p>
              {event.location ? (
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{event.location}</span>
                </p>
              ) : null}
              <p className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  {event.goingCount} going
                  {spots != null ? ` · ${spots} places left` : ""}
                </span>
              </p>
            </div>
            <p className="text-lg font-semibold text-accent">{formatEventPrice(event)}</p>
            <div className="flex flex-wrap items-center gap-3">
              <EventCalendarActions event={event} />
              {isOnlineEvent(event.format) ? (
                <Link
                  href={`/events/${event.slug}/live`}
                  className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground"
                >
                  Open live room
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
          <article className="space-y-6">
            <section className="rounded-[1.6rem] border border-border bg-surface p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">About this programme</h2>
              <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-muted">
                {event.description}
              </p>
            </section>

            <section className="rounded-[1.6rem] border border-border bg-surface p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">What you will cover</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                {copy.outline.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-border bg-surface p-6">
                <h2 className="font-display text-xl font-semibold">Who it is for</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{copy.audience}</p>
              </div>
              <div className="rounded-[1.6rem] border border-border bg-surface p-6">
                <h2 className="font-display text-xl font-semibold">What is included</h2>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  {copy.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-border bg-surface p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">Schedule</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                {copy.schedule.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          </article>

          <div className="lg:sticky lg:top-28">
            {canRegister ? (
              <EventRegisterForm
                event={event}
                signedIn={signedIn}
                defaultName={defaultName}
                defaultEmail={defaultEmail}
                onRegistered={() =>
                  setEvent((current) => ({
                    ...current,
                    registered: true,
                    goingCount: current.goingCount + 1,
                  }))
                }
              />
            ) : (
              <div className="rounded-[1.6rem] border border-border bg-surface p-6 text-sm text-muted">
                Enrollment is closed for this programme.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
