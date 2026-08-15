export type EventTab = "all" | "free" | "paid" | "open";

export function asEventTab(value?: string | null): EventTab {
  if (value === "all" || value === "free" || value === "paid" || value === "open") {
    return value;
  }
  return "all";
}

export type PaymentMethod = "NONE" | "BANK_TRANSFER" | "PAYMENT_LINK" | "PAYSTACK";
export type EventFormat = "IN_PERSON" | "ONLINE_APP" | "ZOOM" | "GOOGLE_MEET" | "HYBRID";
export type EventSessionPhase = "upcoming" | "live" | "ended";
export type PaymentStatus = "NOT_REQUIRED" | "UNPAID" | "SUBMITTED" | "PAID";

export interface EducationItem {
  school: string;
  degree: string;
  dates?: string;
}

export interface JobItem {
  title: string;
  company: string;
  dates?: string;
}

export interface ProfilePayload {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  location: string | null;
  bio: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  education: EducationItem[];
  jobs: JobItem[];
  skills: string[];
  interestTags: string[];
}

export interface EventAttendee {
  name: string;
  image: string | null;
}

export interface EventCardPayload {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: "CAMP" | "WORKSHOP" | "MASTERCLASS" | "OTHER";
  category: string;
  organizer: string;
  status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";
  location: string | null;
  format: EventFormat;
  meetingUrl: string | null;
  meetingId: string | null;
  meetingPasscode: string | null;
  streamUrl: string | null;
  timezone: string;
  startDate: string;
  endDate: string | null;
  coverImage: string | null;
  priceLabel: string | null;
  requiresPayment: boolean;
  priceAmount: number | null;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentLink: string | null;
  paymentInstructions: string | null;
  capacity: number | null;
  outline: string | null;
  audience: string | null;
  includes: string | null;
  scheduleNotes: string | null;
  requireLogin: boolean;
  collectPhone: boolean;
  collectNotes: boolean;
  collectCity: boolean;
  collectEmergency: boolean;
  collectExperience: boolean;
  collectPortfolio: boolean;
  collectGuardian: boolean;
  confirmationMessage: string | null;
  goingCount: number;
  interestedCount: number;
  attendees: EventAttendee[];
  interested: boolean;
  registered: boolean;
}

export function eventMatchesTab(
  event: Pick<EventCardPayload, "status" | "requiresPayment">,
  tab: EventTab,
) {
  if (event.status === "DRAFT") {
    return false;
  }
  if (tab === "free") {
    return !event.requiresPayment;
  }
  if (tab === "paid") {
    return event.requiresPayment;
  }
  if (tab === "open") {
    return event.status === "OPEN";
  }
  return event.status === "OPEN" || event.status === "CLOSED";
}

export interface EventLivePayload {
  eventId: string;
  goingCount: number;
  interestedCount: number;
  attendees: EventAttendee[];
}

export function formatEventPrice(event: Pick<EventCardPayload, "requiresPayment" | "priceAmount" | "currency" | "priceLabel">) {
  if (!event.requiresPayment) {
    return event.priceLabel || "Free";
  }
  if (event.priceAmount != null) {
    const amount = new Intl.NumberFormat("en-NG").format(event.priceAmount);
    return event.currency === "NGN" ? `₦${amount}` : `${event.currency} ${amount}`;
  }
  return event.priceLabel || "Payment required";
}

export interface EnrollmentDetails {
  city?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  experienceLevel?: string;
  roleInterest?: string;
  portfolioUrl?: string;
  heardFrom?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export function isOnlineEvent(format: EventFormat) {
  return format !== "IN_PERSON";
}

export function eventFormatLabel(format: EventFormat) {
  if (format === "ONLINE_APP") {
    return "In the app";
  }
  if (format === "ZOOM") {
    return "Zoom";
  }
  if (format === "GOOGLE_MEET") {
    return "Google Meet";
  }
  if (format === "HYBRID") {
    return "Studio + online";
  }
  return "In person";
}

export function eventSessionPhase(startDate: string, endDate?: string | null): EventSessionPhase {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : start + 3 * 60 * 60 * 1000;
  if (now < start) {
    return "upcoming";
  }
  if (now > end) {
    return "ended";
  }
  return "live";
}

export function eventLines(value?: string | null) {
  if (!value) {
    return [];
  }
  return value
    .split(/\n+/)
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}
