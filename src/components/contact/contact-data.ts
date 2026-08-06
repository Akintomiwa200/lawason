import { Building2, Clapperboard, MessageCircle, Users } from "lucide-react";

import { company } from "@/lib/company";

export const contactChannels = [
  {
    icon: Clapperboard,
    title: "Book productions",
    description: "Schedule gaffer services, lighting design, or on-set support.",
    action: "Book a session",
    href: "/book",
    external: false,
  },
  {
    icon: MessageCircle,
    title: "Message the studio",
    description: "Fastest way to reach us for collaborations and inquiries.",
    action: "@gmlawasonstudios",
    href: company.social.instagram,
    external: true,
  },
  {
    icon: Building2,
    title: "Visit us",
    description: company.location,
    action: "Ikorodu, Lagos State",
    href: "https://maps.google.com/?q=Ikorodu,Lagos,Nigeria",
    external: true,
  },
  {
    icon: Users,
    title: "Connect on LinkedIn",
    description: "Follow studio updates and connect with Godwin Lawani.",
    action: "View profile",
    href: company.social.linkedin,
    external: true,
  },
] as const;
