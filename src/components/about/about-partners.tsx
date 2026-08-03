"use client";

import { PartnerMarquee } from "@/components/shared/partner-marquee";

export function AboutPartners() {
  return (
    <section className="bg-[var(--lp-bg)] py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="text-center text-base text-[var(--lp-text-muted)] md:text-lg">
          Collaborations, productions &amp; industry partners.
        </p>

        <div className="relative mt-10 overflow-hidden">
          <PartnerMarquee
            fadeClassName="from-[var(--lp-bg)]"
            itemClassName="text-[var(--lp-text)]"
            duration={32}
          />
        </div>
      </div>
    </section>
  );
}
