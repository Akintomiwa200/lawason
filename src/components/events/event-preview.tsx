"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { EventCalendarActions } from "@/components/events/event-calendar-actions";
import { eventPageCopy } from "@/lib/event-copy";
import { eventFormatLabel, formatEventPrice, isOnlineEvent, type EventCardPayload } from "@/types/events";

const typeLabels: Record<EventCardPayload["type"], string> = {
  CAMP: "Camp",
  WORKSHOP: "Workshop",
  MASTERCLASS: "Masterclass",
  OTHER: "Programme",
};

function formatEventDate(value: string, endDate?: string | null) {
  const start = new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!endDate) {
    return start;
  }
  const end = new Date(endDate).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return start === end ? start : `${start} – ${end}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function EventPreview({ event }: { event: EventCardPayload | null }) {
  if (!event) {
    return (
      <aside className="min-h-[36rem] rounded-[1.6rem] border border-border bg-surface p-6">
        <p className="font-display text-xl font-semibold text-foreground">Event details</p>
        <p className="mt-2 text-sm text-muted">
          Select a programme on the right to read the description, dates, fee, and enrollment
          details here.
        </p>
      </aside>
    );
  }

  const open = event.status === "OPEN";
  const copy = eventPageCopy(event);
  const spots = event.capacity != null ? Math.max(event.capacity - event.goingCount, 0) : null;

  return (
    <aside className="flex min-h-[42rem] max-h-[calc(100vh-7.5rem)] flex-col overflow-y-auto rounded-[1.6rem] border border-border bg-surface">
      <div className="relative h-56 bg-surface-elevated">
        {event.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,var(--spotlight),transparent_65%)]" />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {open ? "Open enrollment" : "Enrollment closed"} · {typeLabels[event.type]} ·{" "}
            {eventFormatLabel(event.format)}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">{event.title}</h2>
          <p className="mt-1 text-sm text-muted">By {event.organizer}</p>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Date</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {formatEventDate(event.startDate, event.endDate)}
              </dd>
            </div>
          </div>
          {event.location ? (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted">Location</dt>
                <dd className="mt-0.5 font-medium text-foreground">{event.location}</dd>
              </div>
            </div>
          ) : null}
          <div className="flex gap-3">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Places</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {event.goingCount} going
                {spots != null ? ` · ${spots} left` : ""}
                {event.capacity != null ? ` of ${event.capacity}` : ""}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">Fee</dt>
            <dd className="mt-0.5 text-base font-semibold text-accent">{formatEventPrice(event)}</dd>
            {event.requiresPayment ? (
              <p className="mt-1 text-xs text-muted">
                {event.paymentMethod === "PAYMENT_LINK" ? "Pay with the studio link" : "Bank transfer after enrollment"}
              </p>
            ) : null}
          </div>
        </dl>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">About</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{event.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">What you will cover</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground">
            {copy.outline.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Who it is for</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.audience}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Included</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground">
            {copy.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Schedule</h3>
          <ol className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
            {copy.schedule.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {event.attendees.map((person) =>
              person.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${person.name}-${person.image}`}
                  src={person.image}
                  alt={person.name}
                  className="h-8 w-8 rounded-full border-2 border-surface object-cover"
                />
              ) : (
                <span
                  key={person.name}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-elevated text-[10px] font-semibold text-muted"
                >
                  {initials(person.name)}
                </span>
              ),
            )}
          </div>
          <p className="text-xs text-muted">
            {event.goingCount} going · {event.interestedCount} interested
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Calendar</h3>
          <div className="mt-2">
            <EventCalendarActions event={event} />
          </div>
        </div>

        <div className="mt-auto space-y-2 pt-2">
          {isOnlineEvent(event.format) ? (
            <Link
              href={`/events/${event.slug}/live`}
              className="inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-3 text-sm font-semibold hover:border-accent hover:text-accent"
            >
              Open live room
            </Link>
          ) : null}
          {open ? (
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
            >
              Open enrollment
            </Link>
          ) : (
            <p className="rounded-2xl bg-surface-elevated px-4 py-3 text-sm text-muted">
              Enrollment is not open for this programme.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
