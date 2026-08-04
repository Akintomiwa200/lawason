"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HomeHeroPartners } from "@/components/home/home-hero-partners";
import { Reveal, ScaleIn } from "@/components/motion/reveal";
import { company } from "@/lib/company";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--hero-gradient-from)] via-[var(--hero-gradient-via)] to-background pb-4">
      <Reveal className="mx-auto max-w-3xl px-6 pt-24 text-center sm:pt-28 md:pt-32">
        <p className="font-display text-base italic text-foreground/85 md:text-lg">
          Light-first craft. Real results.
        </p>

        <h1 className="mx-auto mt-4 max-w-[16ch] font-display text-[clamp(2.35rem,7.5vw,4.5rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-foreground">
          Light That Builds Stories
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          {company.name} specializes in filmmaking, cinematography, and special
          effect lighting — helping Nollywood productions stand out on set and
          on screen from {company.location}.
        </p>

        <div className="mt-7 flex justify-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            Book a session
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>

      <ScaleIn
        delay={0.12}
        className="relative mx-auto mt-12 w-full max-w-4xl px-6 sm:mt-14 md:mt-16"
      >
        <div className="relative mx-auto aspect-[1024/1536] w-full max-w-[580px] overflow-hidden rounded-2xl">
          <Image
            src="/hero_image.png"
            alt="GM Lawason Studios on-set production showcase"
            fill
            priority
            sizes="(max-width: 768px) 92vw, 580px"
            className="object-cover object-top"
          />
        </div>
      </ScaleIn>

      <HomeHeroPartners />
    </section>
  );
}
