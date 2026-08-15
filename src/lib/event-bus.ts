import type { EventLivePayload } from "@/types/events";

type Listener = (payload: EventLivePayload) => void;

const listeners = new Set<Listener>();

export function publishEventLive(payload: EventLivePayload) {
  for (const listener of listeners) {
    listener(payload);
  }
}

export function subscribeEventLive(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
