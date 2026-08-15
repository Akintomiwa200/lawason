import type { EventCardPayload } from "@/types/events";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toUtcStamp(value: string) {
  const date = new Date(value);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function eventJoinUrl(event: EventCardPayload, origin: string) {
  if (event.format === "ONLINE_APP" || event.format === "HYBRID") {
    return `${origin}/events/${event.slug}/live`;
  }
  return event.meetingUrl || `${origin}/events/${event.slug}`;
}

export function buildGoogleCalendarUrl(event: EventCardPayload, origin: string) {
  const end = event.endDate ?? new Date(new Date(event.startDate).getTime() + 3 * 60 * 60 * 1000).toISOString();
  const dates = `${toUtcStamp(event.startDate)}/${toUtcStamp(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: `${event.description}\n\nJoin: ${eventJoinUrl(event, origin)}`,
    location: event.meetingUrl || event.location || "GM Lawason Studios",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(event: EventCardPayload, origin: string) {
  const end = event.endDate ?? new Date(new Date(event.startDate).getTime() + 3 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    rru: "addevent",
    subject: event.title,
    startdt: event.startDate,
    enddt: end,
    body: `${event.description}\n\nJoin: ${eventJoinUrl(event, origin)}`,
    location: event.meetingUrl || event.location || "GM Lawason Studios",
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

export function buildIcs(event: EventCardPayload, origin: string) {
  const end = event.endDate ?? new Date(new Date(event.startDate).getTime() + 3 * 60 * 60 * 1000).toISOString();
  const join = eventJoinUrl(event, origin);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GM Lawason Studios//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@gmlawason`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${toUtcStamp(event.startDate)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(`${event.description}\n\nJoin: ${join}`)}`,
    `LOCATION:${escapeIcs(event.meetingUrl || event.location || "GM Lawason Studios")}`,
    `URL:${join}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
