"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { publishEventLive } from "@/lib/event-bus";
import { getEventLiveSnapshot } from "@/lib/event-queries";
import { requireAdmin, requireUser } from "@/lib/require-session";
import { slugify } from "@/lib/slug";

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  type: z.enum(["CAMP", "WORKSHOP", "MASTERCLASS", "OTHER"]).default("CAMP"),
  status: z.enum(["DRAFT", "OPEN", "CLOSED", "COMPLETED"]).default("DRAFT"),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  coverImage: z.string().optional(),
  priceLabel: z.string().optional(),
  category: z.string().optional(),
  organizer: z.string().optional(),
  requiresPayment: z.boolean().default(false),
  priceAmount: z.number().int().nonnegative().optional(),
  currency: z.string().default("NGN"),
  paymentMethod: z.enum(["NONE", "BANK_TRANSFER", "PAYMENT_LINK", "PAYSTACK"]).default("NONE"),
  paymentLink: z.string().optional(),
  paymentInstructions: z.string().optional(),
  format: z.enum(["IN_PERSON", "ONLINE_APP", "ZOOM", "GOOGLE_MEET", "HYBRID"]).default("IN_PERSON"),
  meetingUrl: z.string().optional(),
  meetingId: z.string().optional(),
  meetingPasscode: z.string().optional(),
  streamUrl: z.string().optional(),
  timezone: z.string().default("Africa/Lagos"),
  outline: z.string().optional(),
  audience: z.string().optional(),
  includes: z.string().optional(),
  scheduleNotes: z.string().optional(),
  requireLogin: z.boolean().default(false),
  collectPhone: z.boolean().default(true),
  collectNotes: z.boolean().default(true),
  collectCity: z.boolean().default(true),
  collectEmergency: z.boolean().default(true),
  collectExperience: z.boolean().default(true),
  collectPortfolio: z.boolean().default(true),
  collectGuardian: z.boolean().default(false),
  confirmationMessage: z.string().optional(),
});

export async function saveEvent(input: z.infer<typeof eventSchema>) {
  await requireAdmin();
  const data = eventSchema.parse(input);
  const slug = slugify(data.slug || data.title);

  const payload = {
    title: data.title,
    slug,
    description: data.description,
    type: data.type,
    status: data.status,
    location: data.location || null,
    format: data.format,
    meetingUrl: data.meetingUrl || null,
    meetingId: data.meetingId || null,
    meetingPasscode: data.meetingPasscode || null,
    streamUrl: data.streamUrl || null,
    timezone: data.timezone || "Africa/Lagos",
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : null,
    capacity: data.capacity ?? null,
    coverImage: data.coverImage || null,
    priceLabel: data.priceLabel || null,
    category: data.category || null,
    organizer: data.organizer || null,
    requiresPayment: data.requiresPayment,
    priceAmount: data.priceAmount ?? null,
    currency: data.currency || "NGN",
    paymentMethod: data.requiresPayment ? data.paymentMethod : "NONE",
    paymentLink: data.paymentLink || null,
    paymentInstructions: data.paymentInstructions || null,
    outline: data.outline || null,
    audience: data.audience || null,
    includes: data.includes || null,
    scheduleNotes: data.scheduleNotes || null,
    requireLogin: data.requireLogin,
    collectPhone: data.collectPhone,
    collectNotes: data.collectNotes,
    collectCity: data.collectCity,
    collectEmergency: data.collectEmergency,
    collectExperience: data.collectExperience,
    collectPortfolio: data.collectPortfolio,
    collectGuardian: data.collectGuardian,
    confirmationMessage: data.confirmationMessage || null,
  };

  const event = data.id
    ? await prisma.event.update({ where: { id: data.id }, data: payload })
    : await prisma.event.create({ data: payload });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);

  return { id: event.id, slug: event.slug };
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const event = await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
}

const registrationSchema = z.object({
  eventSlug: z.string(),
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  details: z
    .object({
      city: z.string().optional(),
      dateOfBirth: z.string().optional(),
      gender: z.string().optional(),
      emergencyName: z.string().optional(),
      emergencyPhone: z.string().optional(),
      experienceLevel: z.string().optional(),
      roleInterest: z.string().optional(),
      portfolioUrl: z.string().optional(),
      heardFrom: z.string().optional(),
      guardianName: z.string().optional(),
      guardianPhone: z.string().optional(),
    })
    .optional(),
});

export async function registerForEvent(input: z.infer<typeof registrationSchema>) {
  const data = registrationSchema.parse(input);
  const event = await prisma.event.findUnique({
    where: { slug: data.eventSlug },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event || event.status !== "OPEN") {
    throw new Error("This registration is not open");
  }

  if (event.capacity && event._count.registrations >= event.capacity) {
    throw new Error("This event is full");
  }

  let userId: string | undefined;
  try {
    const session = await requireUser();
    userId = session.user.id;
  } catch {
    userId = undefined;
  }

  if (event.requireLogin && !userId) {
    throw new Error("Sign in to enroll in this programme");
  }

  const existing = await prisma.eventRegistration.findFirst({
    where: {
      eventId: event.id,
      email: data.email.toLowerCase(),
      status: { not: "CANCELLED" },
    },
  });

  if (existing) {
    throw new Error("This email is already registered");
  }

  const registration = await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      userId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      notes: data.notes || null,
      details: data.details ?? undefined,
      paymentStatus: event.requiresPayment ? "UNPAID" : "NOT_REQUIRED",
    },
  });

  const snapshot = await getEventLiveSnapshot(event.id);
  if (snapshot) {
    publishEventLive(snapshot);
  }

  revalidatePath("/admin/registrations");
  revalidatePath("/events");
  revalidatePath(`/events/${event.slug}`);
  revalidatePath(`/events/${event.slug}/live`);

  return {
    id: registration.id,
    email: registration.email,
    requiresPayment: event.requiresPayment,
    paymentMethod: event.paymentMethod,
  };
}

export async function updateRegistrationStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED",
) {
  await requireAdmin();
  await prisma.eventRegistration.update({
    where: { id },
    data: {
      status,
      paymentStatus: status === "CONFIRMED" ? "PAID" : undefined,
    },
  });
  revalidatePath("/admin/registrations");
}

export async function submitPaymentReference(eventSlug: string, reference: string) {
  const session = await requireUser();
  const trimmed = reference.trim();
  if (trimmed.length < 3) {
    throw new Error("Enter a payment reference");
  }

  const registration = await prisma.eventRegistration.findFirst({
    where: {
      event: { slug: eventSlug },
      userId: session.user.id,
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!registration) {
    throw new Error("No enrollment found for this programme");
  }

  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: {
      paymentReference: trimmed,
      paymentStatus: "SUBMITTED",
    },
  });

  revalidatePath("/admin/registrations");
  revalidatePath(`/events/${eventSlug}`);
}
