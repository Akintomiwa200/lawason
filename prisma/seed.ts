import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient, type EventType, type PaymentMethod, type EventStatus } from "@prisma/client";
import { hash } from "bcryptjs";

function loadLocalEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const eq = trimmed.indexOf("=");
      if (eq === -1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional
  }
}

loadLocalEnv();

const prisma = new PrismaClient();

const samples: {
  slug: string;
  title: string;
  description: string;
  type: EventType;
  category: string;
  organizer: string;
  status: EventStatus;
  location: string;
  startDate: Date;
  endDate?: Date;
  capacity: number;
  coverImage: string;
  requiresPayment: boolean;
  priceAmount?: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  paymentLink?: string;
  paymentInstructions?: string;
  requireLogin?: boolean;
  confirmationMessage?: string;
  format?: "IN_PERSON" | "ONLINE_APP" | "ZOOM" | "GOOGLE_MEET" | "HYBRID";
  meetingUrl?: string;
  meetingId?: string;
  meetingPasscode?: string;
  streamUrl?: string;
  outline?: string;
  audience?: string;
  includes?: string;
  scheduleNotes?: string;
  collectGuardian?: boolean;
}[] = [
  {
    slug: "summer-camp",
    title: "GM Lawason Summer Camp",
    description:
      "Two weeks of lighting, camera, and storytelling with the academy team. Built for young creatives ready to work on a real set.",
    type: "CAMP",
    category: "Camp",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-07-06T09:00:00.000Z"),
    endDate: new Date("2026-07-18T17:00:00.000Z"),
    capacity: 40,
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f55377?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 150000,
    currency: "NGN",
    paymentMethod: "BANK_TRANSFER",
    paymentInstructions: "Pay ₦150,000 to GM Lawason Studios.\nBank: Access Bank\nAccount: 0123456789\nUse your full name as the reference.",
    confirmationMessage: "You're on the summer camp list. Send your payment reference to complete enrollment.",
    collectGuardian: true,
  },
  {
    slug: "gaffer-masterclass",
    title: "Gaffer Masterclass",
    description: "Set lighting craft, special effects, and on-set leadership with Godwin Lawani.",
    type: "MASTERCLASS",
    category: "Lighting",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-09-12T09:00:00.000Z"),
    endDate: new Date("2026-09-13T17:00:00.000Z"),
    capacity: 24,
    coverImage:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 80000,
    currency: "NGN",
    paymentMethod: "PAYMENT_LINK",
    paymentLink: "https://paystack.com/pay/gmlawason-gaffer",
    paymentInstructions: "Complete payment with the studio Paystack link, then paste your receipt reference.",
  },
  {
    slug: "camera-workshop",
    title: "Camera & Story Workshop",
    description:
      "Two days on composition, movement, and visual storytelling for emerging cinematographers. You work a short scene from brief to last take — lenses, coverage, and how the camera talks to lighting.",
    type: "WORKSHOP",
    category: "Camera",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu studio, Lagos",
    startDate: new Date("2026-10-03T09:00:00.000Z"),
    endDate: new Date("2026-10-04T17:00:00.000Z"),
    capacity: 30,
    coverImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    outline:
      "Framing, lenses, and coverage for a short scene\nCamera movement that serves story, not the operator\nWorking with the gaffer on motivated light\nShot lists, communication, and playback notes",
    audience:
      "Camera assistants, emerging DoPs, and storytellers who want to operate with intent on a real set.",
    includes:
      "Two full studio days\nCamera package access\nLunch both days\nShot-list notes and certificate",
    scheduleNotes:
      "Saturday 9:00–17:00 — lenses, composition, blocking.\nSunday 9:00–17:00 — movement, lighting collaboration, scene shoot and playback.",
  },
  {
    slug: "open-set-walkthrough",
    title: "Open Set Walkthrough",
    description: "A free Saturday walkthrough of a working lighting plot — no fee, limited places.",
    type: "OTHER",
    category: "Set",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Studio floor, Ikorodu",
    startDate: new Date("2026-08-29T10:00:00.000Z"),
    endDate: new Date("2026-08-29T13:00:00.000Z"),
    capacity: 18,
    coverImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
  {
    slug: "script-to-screen",
    title: "Script to Screen Lab",
    description: "Turn a short scene into a shoot-ready plan: structure, coverage, and lighting intent.",
    type: "WORKSHOP",
    category: "Story",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-11-14T09:00:00.000Z"),
    endDate: new Date("2026-11-15T16:00:00.000Z"),
    capacity: 20,
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 45000,
    currency: "NGN",
    paymentMethod: "BANK_TRANSFER",
    paymentInstructions: "Transfer ₦45,000 to GM Lawason Academy. Use SCRIPT as the narration.",
    requireLogin: true,
  },
  {
    slug: "night-exterior-lighting",
    title: "Night Exterior Lighting",
    description: "Practicals, motivated sources, and special-effect lighting for night streets and compounds.",
    type: "MASTERCLASS",
    category: "Lighting",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu night location",
    startDate: new Date("2026-09-26T17:00:00.000Z"),
    endDate: new Date("2026-09-27T01:00:00.000Z"),
    capacity: 16,
    coverImage:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 120000,
    currency: "NGN",
    paymentMethod: "BANK_TRANSFER",
    paymentInstructions: "₦120,000 to GM Lawason Studios. Bring proof of payment on the night.",
  },
  {
    slug: "community-screening",
    title: "Community Screening Night",
    description: "Free screening of student and studio shorts, followed by a Q&A with the lighting team.",
    type: "OTHER",
    category: "Screening",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Academy hall, Ikorodu",
    startDate: new Date("2026-08-22T18:00:00.000Z"),
    endDate: new Date("2026-08-22T21:00:00.000Z"),
    capacity: 80,
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
  {
    slug: "beginner-grip-day",
    title: "Beginner Grip Day",
    description: "Stands, flags, and safe rigging basics. Free for first-time set assistants.",
    type: "WORKSHOP",
    category: "Grip",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-08-15T09:00:00.000Z"),
    endDate: new Date("2026-08-15T15:00:00.000Z"),
    capacity: 22,
    coverImage:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4dcd2?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
  {
    slug: "commercial-lighting-clinic",
    title: "Commercial Lighting Clinic",
    description: "Product, beauty, and branded-content lighting for fast commercial days.",
    type: "MASTERCLASS",
    category: "Commercial",
    organizer: "GM Lawason Studios",
    status: "CLOSED",
    location: "Lagos studio",
    startDate: new Date("2026-06-20T09:00:00.000Z"),
    endDate: new Date("2026-06-21T17:00:00.000Z"),
    capacity: 12,
    coverImage:
      "https://images.unsplash.com/photo-1492619371915-4bfd18c437dd?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 200000,
    currency: "NGN",
    paymentMethod: "PAYMENT_LINK",
    paymentLink: "https://paystack.com/pay/gmlawason-commercial",
  },
  {
    slug: "easter-teen-camp",
    title: "Easter Teen Film Camp",
    description: "A closed holiday camp for teens — lighting games, camera teams, and a one-day shoot.",
    type: "CAMP",
    category: "Camp",
    organizer: "GM Lawason Academy",
    status: "CLOSED",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-04-03T09:00:00.000Z"),
    endDate: new Date("2026-04-06T16:00:00.000Z"),
    capacity: 35,
    coverImage:
      "https://images.unsplash.com/photo-1524712245566-2f0bf567aa90?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
  {
    slug: "director-of-photography-lab",
    title: "Director of Photography Lab",
    description: "Look development, lensing, and collaboration with the gaffer on a narrative scene.",
    type: "MASTERCLASS",
    category: "Camera",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-12-05T09:00:00.000Z"),
    endDate: new Date("2026-12-07T17:00:00.000Z"),
    capacity: 10,
    coverImage:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 250000,
    currency: "NGN",
    paymentMethod: "BANK_TRANSFER",
    paymentInstructions: "₦250,000 studio fee. Account details sent after enrollment.",
    requireLogin: true,
  },
  {
    slug: "free-portfolio-review",
    title: "Free Portfolio Review",
    description: "Drop your reel or stills. Mentors give notes on lighting, framing, and next steps.",
    type: "OTHER",
    category: "Mentorship",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Online + Ikorodu",
    startDate: new Date("2026-09-05T11:00:00.000Z"),
    endDate: new Date("2026-09-05T15:00:00.000Z"),
    capacity: 50,
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
  {
    slug: "women-in-lighting",
    title: "Women in Lighting Forum",
    description: "A free afternoon of talks and set demos for women working in lighting, grip, and camera.",
    type: "OTHER",
    category: "Community",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Academy hall, Ikorodu",
    startDate: new Date("2026-10-17T11:00:00.000Z"),
    endDate: new Date("2026-10-17T16:00:00.000Z"),
    capacity: 60,
    coverImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
  {
    slug: "steadicam-movement",
    title: "Steadicam & Movement",
    description: "Operating basics, body mechanics, and lighting for moving camera on a narrative beat.",
    type: "WORKSHOP",
    category: "Camera",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: new Date("2026-10-24T09:00:00.000Z"),
    endDate: new Date("2026-10-25T17:00:00.000Z"),
    capacity: 14,
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f55377?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 95000,
    currency: "NGN",
    paymentMethod: "PAYMENT_LINK",
    paymentLink: "https://paystack.com/pay/gmlawason-steadicam",
  },
  {
    slug: "holiday-lighting-intensive",
    title: "Holiday Lighting Intensive",
    description: "A closed December intensive covering festive practicals, mixed colour, and night interiors.",
    type: "MASTERCLASS",
    category: "Lighting",
    organizer: "GM Lawason Studios",
    status: "CLOSED",
    location: "Lagos studio",
    startDate: new Date("2025-12-12T09:00:00.000Z"),
    endDate: new Date("2025-12-14T17:00:00.000Z"),
    capacity: 18,
    coverImage:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 175000,
    currency: "NGN",
    paymentMethod: "BANK_TRANSFER",
    paymentInstructions: "₦175,000 to GM Lawason Studios. Enrollment is closed for this run.",
  },
  {
    slug: "colour-and-texture-walk",
    title: "Colour & Texture Walk",
    description: "Free location walk around Ikorodu: reading available light, colour, and surfaces for night and day.",
    type: "WORKSHOP",
    category: "Location",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu town",
    startDate: new Date("2026-08-30T08:00:00.000Z"),
    endDate: new Date("2026-08-30T12:00:00.000Z"),
    capacity: 25,
    coverImage:
      "https://images.unsplash.com/photo-1440404653325-ab127d49ea17?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    const passwordHash = await hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", passwordHash },
      create: {
        email,
        name: "Studio Admin",
        passwordHash,
        role: "ADMIN",
      },
    });
  }

  for (const sample of samples) {
    const { slug, ...data } = sample;
    await prisma.event.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
