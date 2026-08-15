"use client";

import { buildGoogleCalendarUrl, buildOutlookCalendarUrl } from "@/lib/calendar";
import type { EventCardPayload } from "@/types/events";

export function EventCalendarActions({
  event,
  origin,
}: {
  event: EventCardPayload;
  origin?: string;
}) {
  const host = origin || (typeof window !== "undefined" ? window.location.origin : "");
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`/api/events/${event.slug}/calendar`}
        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent"
      >
        Apple / Outlook .ics
      </a>
      <a
        href={buildGoogleCalendarUrl(event, host)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent"
      >
        Google Calendar
      </a>
      <a
        href={buildOutlookCalendarUrl(event, host)}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent"
      >
        Outlook
      </a>
    </div>
  );
}
