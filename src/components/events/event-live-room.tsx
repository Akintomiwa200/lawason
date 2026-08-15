"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EventCalendarActions } from "@/components/events/event-calendar-actions";
import { useEventLive } from "@/hooks/use-event-live";
import {
  eventFormatLabel,
  eventSessionPhase,
  isOnlineEvent,
  type EventCardPayload,
} from "@/types/events";

function embedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  return url;
}

export function EventLiveRoom({
  event: initialEvent,
  canJoin,
  origin,
}: {
  event: EventCardPayload;
  canJoin: boolean;
  origin: string;
}) {
  const [event, setEvent] = useState(initialEvent);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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

  const phase = eventSessionPhase(event.startDate, event.endDate);
  const remaining = Math.max(0, new Date(event.startDate).getTime() - now);
  const countdown = useMemo(() => {
    const total = Math.floor(remaining / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [remaining]);

  const joinHref =
    event.format === "ONLINE_APP" || event.format === "HYBRID"
      ? event.streamUrl || event.meetingUrl
      : event.meetingUrl;

  return (
    <div className="min-h-screen bg-background px-4 pb-20 pt-24 lg:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Link href={`/events/${event.slug}`} className="text-sm text-muted hover:text-foreground">
          Back to {event.title}
        </Link>

        <div className="overflow-hidden rounded-[1.8rem] border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {eventFormatLabel(event.format)} · {phase === "live" ? "Live now" : phase === "upcoming" ? "Starting soon" : "Ended"}
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold">{event.title}</h1>
            </div>
            <p className="text-sm text-muted">{event.goingCount} in the room</p>
          </div>

          {phase === "upcoming" ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-muted">Doors open at the call time. Add it to your calendar so you do not miss it.</p>
              <p className="mt-4 font-display text-4xl font-semibold text-accent">{countdown}</p>
            </div>
          ) : null}

          {phase === "live" && event.format === "ONLINE_APP" && event.streamUrl && canJoin ? (
            <div className="aspect-video bg-black">
              <iframe
                src={embedUrl(event.streamUrl)}
                title={event.title}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          {phase === "live" && canJoin && joinHref && event.format !== "ONLINE_APP" ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted">The session is live. Join on {eventFormatLabel(event.format)}.</p>
              {event.meetingId ? <p className="mt-2 text-sm">Meeting ID · {event.meetingId}</p> : null}
              {event.meetingPasscode ? <p className="text-sm">Passcode · {event.meetingPasscode}</p> : null}
              <a
                href={joinHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
              >
                Join {eventFormatLabel(event.format)}
              </a>
            </div>
          ) : null}

          {phase === "live" && event.format === "ONLINE_APP" && !event.streamUrl && canJoin ? (
            <div className="px-6 py-12 text-center">
              <p className="font-display text-2xl font-semibold">You are in the studio room</p>
              <p className="mt-2 text-sm text-muted">
                Mentors can see you are present. Stay on this page for notes and the live count.
              </p>
            </div>
          ) : null}

          {!canJoin ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted">
                Enroll{event.requiresPayment ? " and complete payment" : ""} to join this session.
              </p>
              <Link
                href={`/events/${event.slug}`}
                className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                Open enrollment
              </Link>
            </div>
          ) : null}

          {phase === "ended" ? (
            <div className="px-6 py-12 text-center text-sm text-muted">This session has ended.</div>
          ) : null}
        </div>

        <div className="rounded-[1.6rem] border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-semibold">Add to calendar</h2>
          <p className="mt-1 text-sm text-muted">
            Same event, live in the app{isOnlineEvent(event.format) ? ", Zoom, or Google Meet" : ""}.
          </p>
          <div className="mt-4">
            <EventCalendarActions event={event} origin={origin} />
          </div>
        </div>
      </div>
    </div>
  );
}
