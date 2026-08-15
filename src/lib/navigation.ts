export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  // { label: "Events", href: "/events" },
  { label: "Watch", href: "/watch" },
  { label: "Contact", href: "/contact" },
] as const;

export type NavItem = { label: string; href: string };

export const footerNav = {
  studio: [
    { label: "Filmmaking", href: "/services#filmmaking" },
    { label: "Cinematography", href: "/services#cinematography" },
    { label: "Lighting Design", href: "/services#lighting" },
    { label: "Scriptwriting", href: "/services#scriptwriting" },
    { label: "Production Design", href: "/services#production-design" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/work" },
    { label: "The Gaffer Man Show", href: "/work#gaffer-man-show" },
    { label: "Contact", href: "/contact" },
    { label: "Book a Session", href: "/book" },
    { label: "Academy", href: "/about#academy" },
    { label: "Events & camps", href: "/events" },
    { label: "Watch", href: "/watch" },
  ],
  resources: [
    { label: "Instagram", href: "https://www.instagram.com/gmlawasonstudios/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/godwin-lawani-8b208794" },
    { label: "Services", href: "/services" },
    { label: "Studio Work", href: "/work" },
    { label: "Get in Touch", href: "/contact" },
  ],
} as const;
