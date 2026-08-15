"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { loginHref } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";
import { eventFormatLabel, formatEventPrice, isOnlineEvent, type EventCardPayload } from "@/types/events";

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function EventCard({
  event,
  selected = false,
  onSelect,
  onInterest,
}: {
  event: EventCardPayload;
  selected?: boolean;
  onSelect?: (event: EventCardPayload) => void;
  onInterest: (eventId: string, interested: boolean) => void;
}) {
  const router = useRouter();
  const extraGoing = Math.max(event.goingCount - event.attendees.length, 0);

  async function toggleInterest(click: React.MouseEvent) {
    click.preventDefault();
    click.stopPropagation();

    if (event.id.startsWith("sample-")) {
      onInterest(event.id, !event.interested);
      return;
    }

    const response = await fetch(`/api/events/${event.id}/interest`, { method: "POST" });
    const payload = (await response.json()) as { interested?: boolean; error?: string };

    if (response.status === 401) {
      router.push(loginHref("/events"));
      return;
    }

    if (!response.ok) {
      toast.error(payload.error ?? "Could not update interest");
      return;
    }

    onInterest(event.id, Boolean(payload.interested));
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className={cn(
        "group relative block w-full overflow-hidden rounded-[1.6rem] border bg-surface text-left shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5",
        selected ? "border-accent shadow-glow" : "border-border hover:border-accent/50",
      )}
    >
      <div className="relative h-56 overflow-hidden bg-surface-elevated">
        {event.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,var(--spotlight),transparent_65%),linear-gradient(135deg,var(--hero-gradient-from),var(--background))]" />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
          {event.category}
          {isOnlineEvent(event.format) ? ` · ${eventFormatLabel(event.format)}` : ""}
        </span>
        <span
          role="presentation"
          onClick={toggleInterest}
          className={cn(
            "absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition",
            event.interested
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-surface text-accent",
          )}
        >
          <Star className={cn("h-4 w-4", event.interested ? "fill-current" : "")} />
        </span>
      </div>

      <div className="w-full bg-surface p-5">
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-muted">By {event.organizer}</p>
        <p className="mt-3 text-sm font-medium text-foreground">{formatEventDate(event.startDate)}</p>
        {event.location ? (
          <p className="mt-1 line-clamp-1 text-sm text-muted">{event.location}</p>
        ) : null}
        <p className="mt-2 text-sm font-semibold text-accent">{formatEventPrice(event)}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {event.attendees.map((person) =>
              person.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${person.name}-${person.image}`}
                  src={person.image}
                  alt={person.name}
                  className="h-7 w-7 rounded-full border-2 border-surface object-cover"
                />
              ) : (
                <span
                  key={person.name}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-surface-elevated text-[10px] font-semibold text-muted"
                >
                  {initials(person.name)}
                </span>
              ),
            )}
          </div>
          <p className="text-xs text-muted">
            {event.goingCount > 0
              ? extraGoing > 0
                ? `+${extraGoing} others are going`
                : `${event.goingCount} going`
              : event.interestedCount > 0
                ? `${event.interestedCount} interested`
                : "Be the first to go"}
          </p>
        </div>
      </div>
    </button>
  );
}
