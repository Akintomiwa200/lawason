import { homeImages } from "@/lib/home-images";

export interface WorkItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const works: WorkItem[] = [
  {
    id: 1,
    slug: "gaffer-man-show",
    title: "The Gaffer Man Show",
    category: "Featured",
    description:
      "A studio-led show going behind the scenes with industry leaders.",
    image: homeImages.portrait.src,
    imageAlt: homeImages.portrait.alt,
  },
  {
    id: 2,
    slug: "nollywood-lighting",
    title: "Nollywood Set Lighting",
    category: "Lighting",
    description:
      "Professional lighting team delivering cinematic visuals on demanding schedules.",
    image: homeImages.crew.src,
    imageAlt: homeImages.crew.alt,
  },
  {
    id: 3,
    slug: "amriona-light-team",
    title: "Amriona Light Team",
    category: "Team",
    description:
      "Precision lighting deployments for productions requiring expert gaffer craft.",
    image: homeImages.lighting.src,
    imageAlt: homeImages.lighting.alt,
  },
];

export const clientLogos = [
  "ARRI",
  "Canon",
  "RED",
  "Sony",
  "Blackmagic",
] as const;
