import { prisma } from "@/lib/db";
import { company } from "@/lib/company";
import { isDatabaseConfigured } from "@/lib/env";
import { filterEventSamples } from "@/lib/event-samples";
import type { EventAttendee, EventCardPayload, EventTab, ProfilePayload } from "@/types/events";

const typeLabels: Record<EventCardPayload["type"], string> = {
  CAMP: "Camp",
  WORKSHOP: "Workshop",
  MASTERCLASS: "Masterclass",
  OTHER: "Programme",
};

function toAttendees(
  registrations: { name: string; user: { name: string | null; image: string | null } | null }[],
): EventAttendee[] {
  return registrations.slice(0, 3).map((registration) => ({
    name: registration.user?.name || registration.name,
    image: registration.user?.image ?? null,
  }));
}

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: EventCardPayload["type"];
  category: string | null;
  organizer: string | null;
  status: EventCardPayload["status"];
  location: string | null;
  format: EventCardPayload["format"];
  meetingUrl: string | null;
  meetingId: string | null;
  meetingPasscode: string | null;
  streamUrl: string | null;
  timezone: string;
  startDate: Date;
  endDate: Date | null;
  coverImage: string | null;
  priceLabel: string | null;
  capacity: number | null;
  outline: string | null;
  audience: string | null;
  includes: string | null;
  scheduleNotes: string | null;
  requiresPayment: boolean;
  priceAmount: number | null;
  currency: string;
  paymentMethod: EventCardPayload["paymentMethod"];
  paymentLink: string | null;
  paymentInstructions: string | null;
  requireLogin: boolean;
  collectPhone: boolean;
  collectNotes: boolean;
  collectCity: boolean;
  collectEmergency: boolean;
  collectExperience: boolean;
  collectPortfolio: boolean;
  collectGuardian: boolean;
  confirmationMessage: string | null;
  registrations: {
    name: string;
    status: string;
    userId: string | null;
    user: { name: string | null; image: string | null } | null;
  }[];
  interests: { userId: string }[];
};

export function serializeEventCard(event: EventRecord, userId?: string): EventCardPayload {
  const activeRegistrations = event.registrations.filter(
    (registration) => registration.status !== "CANCELLED",
  );

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    type: event.type,
    category: event.category || typeLabels[event.type],
    organizer: event.organizer || company.name,
    status: event.status,
    location: event.location,
    format: event.format,
    meetingUrl: event.meetingUrl,
    meetingId: event.meetingId,
    meetingPasscode: event.meetingPasscode,
    streamUrl: event.streamUrl,
    timezone: event.timezone,
    startDate: event.startDate.toISOString(),
    endDate: event.endDate?.toISOString() ?? null,
    coverImage: event.coverImage,
    priceLabel: event.priceLabel,
    capacity: event.capacity,
    outline: event.outline,
    audience: event.audience,
    includes: event.includes,
    scheduleNotes: event.scheduleNotes,
    requiresPayment: event.requiresPayment,
    priceAmount: event.priceAmount,
    currency: event.currency,
    paymentMethod: event.paymentMethod,
    paymentLink: event.paymentLink,
    paymentInstructions: event.paymentInstructions,
    requireLogin: event.requireLogin,
    collectPhone: event.collectPhone,
    collectNotes: event.collectNotes,
    collectCity: event.collectCity,
    collectEmergency: event.collectEmergency,
    collectExperience: event.collectExperience,
    collectPortfolio: event.collectPortfolio,
    collectGuardian: event.collectGuardian,
    confirmationMessage: event.confirmationMessage,
    goingCount: activeRegistrations.length,
    interestedCount: event.interests.length,
    attendees: toAttendees(activeRegistrations),
    interested: userId ? event.interests.some((item) => item.userId === userId) : false,
    registered: userId
      ? activeRegistrations.some((item) => item.userId === userId)
      : false,
  };
}

export const eventInclude = {
  registrations: {
    where: { status: { not: "CANCELLED" as const } },
    select: {
      name: true,
      status: true,
      userId: true,
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" as const },
    take: 8,
  },
  interests: { select: { userId: true } },
};

export async function getEventCards(tab: EventTab, userId?: string) {
  if (!isDatabaseConfigured()) {
    return filterEventSamples(tab);
  }

  try {
    const where =
      tab === "free"
        ? { status: { in: ["OPEN" as const, "CLOSED" as const] }, requiresPayment: false }
        : tab === "paid"
          ? { status: { in: ["OPEN" as const, "CLOSED" as const] }, requiresPayment: true }
          : tab === "open"
            ? { status: "OPEN" as const }
            : { status: { in: ["OPEN" as const, "CLOSED" as const] } };

    const events = await prisma.event.findMany({
      where,
      include: eventInclude,
      orderBy: { startDate: "asc" },
    });

    if (events.length === 0) {
      return filterEventSamples(tab);
    }

    return events.map((event) => serializeEventCard(event, userId));
  } catch {
    return filterEventSamples(tab);
  }
}

export async function getEventLiveSnapshot(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: eventInclude,
  });

  if (!event) {
    return null;
  }

  const card = serializeEventCard(event);
  return {
    eventId: event.id,
    goingCount: card.goingCount,
    interestedCount: card.interestedCount,
    attendees: card.attendees,
  };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export async function getProfile(userId: string): Promise<ProfilePayload | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return null;
  }

  const education = Array.isArray(user.education) ? user.education : [];
  const jobs = Array.isArray(user.jobs) ? user.jobs : [];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    location: user.location,
    bio: user.bio,
    facebook: user.facebook,
    twitter: user.twitter,
    linkedin: user.linkedin,
    instagram: user.instagram,
    education: education.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }
      const row = item as Record<string, unknown>;
      if (typeof row.school !== "string" || typeof row.degree !== "string") {
        return [];
      }
      return [{ school: row.school, degree: row.degree, dates: typeof row.dates === "string" ? row.dates : undefined }];
    }),
    jobs: jobs.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }
      const row = item as Record<string, unknown>;
      if (typeof row.title !== "string" || typeof row.company !== "string") {
        return [];
      }
      return [{ title: row.title, company: row.company, dates: typeof row.dates === "string" ? row.dates : undefined }];
    }),
    skills: asStringArray(user.skills),
    interestTags: asStringArray(user.interestTags),
  };
}
