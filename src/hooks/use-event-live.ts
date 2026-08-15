"use client";

import { useEffect, useRef } from "react";

import type { EventLivePayload } from "@/types/events";

interface LiveMessage {
  type?: "snapshot";
  eventId?: string;
  goingCount?: number;
  interestedCount?: number;
  attendees?: EventLivePayload["attendees"];
  events?: EventLivePayload[];
}

export function useEventLive(onUpdate: (payload: EventLivePayload) => void) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const source = new EventSource("/api/events/live");

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as LiveMessage;
        if (payload.type === "snapshot" && payload.events) {
          payload.events.forEach((item) => onUpdateRef.current(item));
          return;
        }
        if (payload.eventId && typeof payload.goingCount === "number") {
          onUpdateRef.current({
            eventId: payload.eventId,
            goingCount: payload.goingCount,
            interestedCount: payload.interestedCount ?? 0,
            attendees: payload.attendees ?? [],
          });
        }
      } catch {
        // ignore malformed frames
      }
    };

    return () => {
      source.close();
    };
  }, []);
}
