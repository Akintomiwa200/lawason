export const partners = [
  {
    id: "amriona-light-team",
    name: "Amriona Light Team",
    href: "/work#amriona-light-team",
  },
  {
    id: "gaffer-man-show",
    name: "The Gaffer Man Show",
    href: "/work#gaffer-man-show",
  },
  {
    id: "film-academy",
    name: "GM Lawason Academy for Film and Media",
    href: "/work#film-academy",
  },
  {
    id: "national-film-institute",
    name: "National Film Institute, Jos",
  },
  {
    id: "nollywood-lighting",
    name: "Nollywood Set Lighting",
    href: "/work#nollywood-lighting",
  },
] as const;

export type Partner = (typeof partners)[number];
