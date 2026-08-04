"use client";

import { PartnerMarquee } from "@/components/shared/partner-marquee";
import { Reveal } from "@/components/motion/reveal";

export function HomeHeroPartners() {
  return (
    <Reveal delay={0.18} className="bg-background/90 py-5">
      <div className="relative mx-auto max-w-6xl overflow-hidden px-6">
        <PartnerMarquee fadeClassName="from-background" itemClassName="text-foreground" />
      </div>
    </Reveal>
  );
}
