import { workItems } from "@/lib/company";
import { homeImages } from "@/lib/home-images";

import type { WorkItem } from "@/components/selected-work/data";

const imageBySlug = {
  "gaffer-man-show": homeImages.portrait,
  "nollywood-lighting": homeImages.crew,
  "amriona-light-team": homeImages.lighting,
  "film-academy": homeImages.cinematographer,
} as const;

export const portfolioWorks: WorkItem[] = workItems.map((item, index) => {
  const image = imageBySlug[item.slug];

  return {
    id: index + 1,
    slug: item.slug,
    title: item.title,
    category: item.tag,
    description: item.description,
    image: image.src,
    imageAlt: image.alt,
  };
});
