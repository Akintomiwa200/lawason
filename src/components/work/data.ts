import { workItems } from "@/lib/company";
import { homeImages } from "@/lib/home-images";

import type { WorkItem } from "@/components/selected-work/data";

const imageBySlug = {
  "gaffer-man-show": homeImages.portrait,
  "nollywood-lighting": homeImages.crew,
  "amriona-light-team": homeImages.lighting,
  "film-academy": homeImages.cinematographer,
} as const;

export type WorkSlug = keyof typeof imageBySlug;

export interface PortfolioWorkDetail extends WorkItem {
  categoryLabel: string;
  summary: string;
  highlights: string[];
  body: string[];
}

const workDetails: Record<
  WorkSlug,
  Pick<PortfolioWorkDetail, "summary" | "highlights" | "body">
> = {
  "gaffer-man-show": {
    summary:
      "A studio-led show going behind the scenes with industry leaders.",
    highlights: [
      "Honest on-set conversations",
      "Leadership & craft focus",
      "Studio-produced episodes",
    ],
    body: [
      "The Gaffer Man Show brings candid conversations with directors, gaffers, and production leaders — exploring what it takes to lead on set and deliver cinematic work under real Nollywood schedules.",
      "Each episode goes beyond gear and lighting setups to examine process, teamwork, and the decisions that shape great productions from call time to wrap.",
    ],
  },
  "nollywood-lighting": {
    summary:
      "Professional lighting teams delivering cinematic visuals on demanding schedules.",
    highlights: [
      "Gaffer-led set deployments",
      "Mood & special effect lighting",
      "Fast-turnaround productions",
    ],
    body: [
      "GM Lawason Studios provides gaffer and lighting design services across Nigerian film productions — from narrative features to commercials and music videos.",
      "The team builds light plans that hold up on tight schedules without sacrificing mood, depth, or the cinematic intent behind every scene.",
    ],
  },
  "amriona-light-team": {
    summary:
      "Specialist lighting deployments for precision gaffer work on set.",
    highlights: [
      "Rigging & light design",
      "Collaborative crew units",
      "On-location expertise",
    ],
    body: [
      "Amriona Light Team supports productions that need dedicated gaffer units — handling rigging, fixture placement, and on-set adjustments through the shoot day.",
      "Deployments are built around the director and DP's visual plan, with experienced crew who understand the pace and standards of Nollywood sets.",
    ],
  },
  "film-academy": {
    summary:
      "Hands-on training for the next generation of filmmakers and lighting professionals.",
    highlights: [
      "Lighting craft fundamentals",
      "Set-ready media education",
      "Industry-rooted curriculum",
    ],
    body: [
      "GM Lawason Academy for Film and Media trains creatives in filmmaking, lighting design, and production craft — bridging classroom learning with real set experience.",
      "Programs focus on practical skills: how light shapes story, how crews collaborate on set, and how to grow from assistant roles into industry-ready professionals.",
    ],
  },
};

export const portfolioWorks: PortfolioWorkDetail[] = workItems.map((item, index) => {
  const slug = item.slug as WorkSlug;
  const image = imageBySlug[slug];
  const detail = workDetails[slug];

  return {
    id: index + 1,
    slug: item.slug,
    title: item.title,
    category: item.tag,
    categoryLabel: item.category,
    description: item.description,
    summary: detail.summary,
    highlights: detail.highlights,
    body: detail.body,
    image: image.src,
    imageAlt: image.alt,
  };
});

export function getWorkBySlug(slug: string) {
  return portfolioWorks.find((work) => work.slug === slug);
}

export function getWorkSlugs() {
  return portfolioWorks.map((work) => work.slug);
}
