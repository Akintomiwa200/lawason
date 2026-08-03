"use client";

import { AboutContactCta } from "@/components/about/about-contact-cta";
import { AboutFaq } from "@/components/about/about-faq";
import { AboutGlobal } from "@/components/about/about-global";
import { AboutHero } from "@/components/about/about-hero";
import { AboutPartners } from "@/components/about/about-partners";
import { AboutStats } from "@/components/about/about-stats";
import { AboutTeam } from "@/components/about/about-team";

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <AboutHero />
      <AboutPartners />
      <AboutStats />
      <AboutTeam />
      <AboutGlobal />
      <AboutFaq />
      <AboutContactCta />
    </div>
  );
}
