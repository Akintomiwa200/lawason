import { eventMatchesTab, type EventAttendee, type EventCardPayload, type EventTab } from "@/types/events";

const faces: EventAttendee[] = [
  {
    name: "Ada Okafor",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Tunde Bakare",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Chioma Eze",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Ibrahim Musa",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Funke Adeyemi",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Kelechi Nwosu",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  },
];

function attendeesFor(index: number): EventAttendee[] {
  return [0, 1, 2].map((offset) => faces[(index + offset) % faces.length]);
}

function sample(
  index: number,
  event: Partial<EventCardPayload> &
    Pick<
      EventCardPayload,
      | "id"
      | "slug"
      | "title"
      | "description"
      | "type"
      | "category"
      | "organizer"
      | "status"
      | "startDate"
      | "requiresPayment"
    >,
): EventCardPayload {
  return {
    location: null,
    format: "IN_PERSON",
    meetingUrl: null,
    meetingId: null,
    meetingPasscode: null,
    streamUrl: null,
    timezone: "Africa/Lagos",
    coverImage: null,
    priceAmount: null,
    currency: "NGN",
    paymentLink: null,
    paymentInstructions: null,
    requireLogin: false,
    collectPhone: true,
    collectNotes: true,
    collectCity: true,
    collectEmergency: true,
    collectExperience: true,
    collectPortfolio: true,
    capacity: 24,
    outline: null,
    audience: null,
    includes: null,
    scheduleNotes: null,
    confirmationMessage: null,
    priceLabel: null,
    endDate: null,
    interested: false,
    registered: false,
    goingCount: 12,
    interestedCount: 8,
    ...event,
    attendees: event.attendees ?? attendeesFor(index),
    paymentMethod: event.paymentMethod ?? (event.requiresPayment ? "BANK_TRANSFER" : "NONE"),
    collectGuardian: event.collectGuardian ?? event.type === "CAMP",
  };
}

export const eventSamples: EventCardPayload[] = [
  sample(0, {
    id: "sample-summer-camp",
    slug: "summer-camp",
    title: "GM Lawason Summer Camp",
    description:
      "Two weeks of lighting, camera, and storytelling with the academy team. Built for young creatives ready to work on a real set.",
    type: "CAMP",
    category: "Camp",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: "2026-07-06T09:00:00.000Z",
    endDate: "2026-07-18T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f55377?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 150000,
    paymentInstructions:
      "Pay ₦150,000 to GM Lawason Studios.\nBank: Access Bank\nAccount: 0123456789\nUse your full name as the reference.",
    confirmationMessage:
      "You're on the summer camp list. Send your payment reference to complete enrollment.",
    goingCount: 28,
    interestedCount: 41,
  }),
  sample(1, {
    id: "sample-gaffer",
    slug: "gaffer-masterclass",
    title: "Gaffer Masterclass",
    description: "Set lighting craft, special effects, and on-set leadership with Godwin Lawani.",
    type: "MASTERCLASS",
    category: "Lighting",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Zoom + Ikorodu studio",
    format: "ZOOM",
    meetingUrl: "https://zoom.us/j/84719236401",
    meetingId: "847 1923 6401",
    meetingPasscode: "gaffer26",
    startDate: "2026-09-12T09:00:00.000Z",
    endDate: "2026-09-13T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 80000,
    paymentMethod: "PAYSTACK",
    paymentInstructions: "Pay with Paystack. Access to the Zoom room opens after payment confirms.",
    goingCount: 19,
    interestedCount: 33,
  }),
  sample(2, {
    id: "sample-camera",
    slug: "camera-workshop",
    title: "Camera & Story Workshop",
    description:
      "Two days on composition, movement, and visual storytelling for emerging cinematographers. You work a short scene from brief to last take — lenses, coverage, and how the camera talks to lighting.",
    type: "WORKSHOP",
    category: "Camera",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu studio, Lagos",
    startDate: "2026-10-03T09:00:00.000Z",
    endDate: "2026-10-04T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    capacity: 30,
    outline:
      "Framing, lenses, and coverage for a short scene\nCamera movement that serves story, not the operator\nWorking with the gaffer on motivated light\nShot lists, communication, and playback notes",
    audience:
      "Camera assistants, emerging DoPs, and storytellers who want to operate with intent on a real set.",
    includes:
      "Two full studio days\nCamera package access\nLunch both days\nShot-list notes and certificate",
    scheduleNotes:
      "Saturday 9:00–17:00 — lenses, composition, blocking.\nSunday 9:00–17:00 — movement, lighting collaboration, scene shoot and playback.",
    goingCount: 14,
    interestedCount: 22,
  }),
  sample(3, {
    id: "sample-walkthrough",
    slug: "open-set-walkthrough",
    title: "Open Set Walkthrough",
    description: "A free Saturday walkthrough of a working lighting plot — no fee, limited places.",
    type: "OTHER",
    category: "Set",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Google Meet + studio floor",
    format: "GOOGLE_MEET",
    meetingUrl: "https://meet.google.com/gml-set-walk",
    startDate: "2026-08-29T10:00:00.000Z",
    endDate: "2026-08-29T13:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 9,
    interestedCount: 17,
  }),
  sample(4, {
    id: "sample-script",
    slug: "script-to-screen",
    title: "Script to Screen Lab",
    description: "Turn a short scene into a shoot-ready plan: structure, coverage, and lighting intent.",
    type: "WORKSHOP",
    category: "Story",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: "2026-11-14T09:00:00.000Z",
    endDate: "2026-11-15T16:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 45000,
    requireLogin: true,
    paymentInstructions: "Transfer ₦45,000 to GM Lawason Academy. Use SCRIPT as the narration.",
    goingCount: 11,
    interestedCount: 26,
  }),
  sample(5, {
    id: "sample-night",
    slug: "night-exterior-lighting",
    title: "Night Exterior Lighting",
    description: "Practicals, motivated sources, and special-effect lighting for night streets and compounds.",
    type: "MASTERCLASS",
    category: "Lighting",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu night location",
    startDate: "2026-09-26T17:00:00.000Z",
    endDate: "2026-09-27T01:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 120000,
    goingCount: 7,
    interestedCount: 19,
  }),
  sample(0, {
    id: "sample-screening",
    slug: "community-screening",
    title: "Community Screening Night",
    description: "Free screening of student and studio shorts, followed by a Q&A with the lighting team.",
    type: "OTHER",
    category: "Screening",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Academy hall, Ikorodu",
    startDate: "2026-08-22T18:00:00.000Z",
    endDate: "2026-08-22T21:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 46,
    interestedCount: 61,
  }),
  sample(1, {
    id: "sample-grip",
    slug: "beginner-grip-day",
    title: "Beginner Grip Day",
    description: "Stands, flags, and safe rigging basics. Free for first-time set assistants.",
    type: "WORKSHOP",
    category: "Grip",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: "2026-08-15T09:00:00.000Z",
    endDate: "2026-08-15T15:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4dcd2?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 16,
    interestedCount: 21,
  }),
  sample(2, {
    id: "sample-commercial",
    slug: "commercial-lighting-clinic",
    title: "Commercial Lighting Clinic",
    description: "Product, beauty, and branded-content lighting for fast commercial days.",
    type: "MASTERCLASS",
    category: "Commercial",
    organizer: "GM Lawason Studios",
    status: "CLOSED",
    location: "Lagos studio",
    startDate: "2026-06-20T09:00:00.000Z",
    endDate: "2026-06-21T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1492619371915-4bfd18c437dd?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 200000,
    paymentMethod: "PAYMENT_LINK",
    paymentLink: "https://paystack.com/pay/gmlawason-commercial",
    goingCount: 12,
    interestedCount: 9,
  }),
  sample(3, {
    id: "sample-easter",
    slug: "easter-teen-camp",
    title: "Easter Teen Film Camp",
    description: "A closed holiday camp for teens — lighting games, camera teams, and a one-day shoot.",
    type: "CAMP",
    category: "Camp",
    organizer: "GM Lawason Academy",
    status: "CLOSED",
    location: "Ikorodu, Lagos",
    startDate: "2026-04-03T09:00:00.000Z",
    endDate: "2026-04-06T16:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1524712245566-2f0bf567aa90?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 35,
    interestedCount: 12,
  }),
  sample(4, {
    id: "sample-dop",
    slug: "director-of-photography-lab",
    title: "Director of Photography Lab",
    description: "Look development, lensing, and collaboration with the gaffer on a narrative scene.",
    type: "MASTERCLASS",
    category: "Camera",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: "2026-12-05T09:00:00.000Z",
    endDate: "2026-12-07T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 250000,
    requireLogin: true,
    paymentInstructions: "₦250,000 studio fee. Account details sent after enrollment.",
    goingCount: 6,
    interestedCount: 18,
  }),
  sample(5, {
    id: "sample-review",
    slug: "free-portfolio-review",
    title: "Free Portfolio Review",
    description: "Drop your reel or stills. Mentors give notes on lighting, framing, and next steps.",
    type: "OTHER",
    category: "Mentorship",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "In the GM Lawason app",
    format: "ONLINE_APP",
    streamUrl: "https://www.youtube.com/embed/live_stream?channel=UC_placeholder",
    startDate: "2026-09-05T11:00:00.000Z",
    endDate: "2026-09-05T15:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 22,
    interestedCount: 40,
  }),
  sample(0, {
    id: "sample-women",
    slug: "women-in-lighting",
    title: "Women in Lighting Forum",
    description:
      "A free afternoon of talks and set demos for women working in lighting, grip, and camera.",
    type: "OTHER",
    category: "Community",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Academy hall, Ikorodu",
    startDate: "2026-10-17T11:00:00.000Z",
    endDate: "2026-10-17T16:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 31,
    interestedCount: 54,
  }),
  sample(1, {
    id: "sample-steadicam",
    slug: "steadicam-movement",
    title: "Steadicam & Movement",
    description: "Operating basics, body mechanics, and lighting for moving camera on a narrative beat.",
    type: "WORKSHOP",
    category: "Camera",
    organizer: "GM Lawason Studios",
    status: "OPEN",
    location: "Ikorodu, Lagos",
    startDate: "2026-10-24T09:00:00.000Z",
    endDate: "2026-10-25T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1471341971476-ae15ff43dd1c?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 95000,
    paymentMethod: "PAYMENT_LINK",
    paymentLink: "https://paystack.com/pay/gmlawason-steadicam",
    goingCount: 8,
    interestedCount: 15,
  }),
  sample(2, {
    id: "sample-holiday",
    slug: "holiday-lighting-intensive",
    title: "Holiday Lighting Intensive",
    description:
      "A closed December intensive covering festive practicals, mixed colour, and night interiors.",
    type: "MASTERCLASS",
    category: "Lighting",
    organizer: "GM Lawason Studios",
    status: "CLOSED",
    location: "Lagos studio",
    startDate: "2025-12-12T09:00:00.000Z",
    endDate: "2025-12-14T17:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: true,
    priceAmount: 175000,
    paymentInstructions: "₦175,000 to GM Lawason Studios. Enrollment is closed for this run.",
    goingCount: 18,
    interestedCount: 7,
  }),
  sample(3, {
    id: "sample-colour",
    slug: "colour-and-texture-walk",
    title: "Colour & Texture Walk",
    description:
      "Free location walk around Ikorodu: reading available light, colour, and surfaces for night and day.",
    type: "WORKSHOP",
    category: "Location",
    organizer: "GM Lawason Academy",
    status: "OPEN",
    location: "Ikorodu town",
    startDate: "2026-08-30T08:00:00.000Z",
    endDate: "2026-08-30T12:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1440404653325-ab127d49ea17?auto=format&fit=crop&w=1600&q=80",
    requiresPayment: false,
    priceAmount: null,
    goingCount: 13,
    interestedCount: 24,
  }),
];

export function filterEventSamples(tab: EventTab) {
  return eventSamples.filter((event) => eventMatchesTab(event, tab));
}

export function getEventSample(slug: string) {
  return eventSamples.find((event) => event.slug === slug) ?? null;
}
