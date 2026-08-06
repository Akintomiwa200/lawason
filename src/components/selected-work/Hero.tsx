"use client";

import { m } from "framer-motion";

import { homeImages } from "@/lib/home-images";

import { AnimatedReveal } from "./AnimatedReveal";
import { clientLogos } from "./data";

export function Hero() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
      <AnimatedReveal y={60}>
        <span className="inline-flex items-center rounded-full bg-[#ece8e3] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.02em] text-[#6b6560] dark:bg-surface dark:text-muted">
          Selected Work
        </span>

        <h2 className="mt-6 max-w-[16ch] text-[42px] font-medium leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] dark:text-foreground md:text-[56px] lg:text-[72px]">
          Productions we craft with{" "}
          <em className="font-[family-name:var(--font-cormorant)] text-[1.05em] font-normal italic tracking-[-0.02em]">
            purpose.
          </em>
        </h2>

        <p className="mt-6 max-w-md text-base leading-[1.7] text-[#6b6560] dark:text-muted md:text-[17px]">
          Including The Gaffer Man Show — conversations with industry leaders
          about craft, leadership, and life on set.
        </p>

        <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-10">
          {clientLogos.map((logo) => (
            <li
              key={logo}
              className="text-xs font-medium tracking-[0.08em] text-[#1a1a1a]/40 uppercase dark:text-foreground/40 sm:text-sm"
            >
              {logo}
            </li>
          ))}
        </ul>
      </AnimatedReveal>

      <AnimatedReveal
        delay={0.12}
        y={60}
        className="relative flex items-start justify-center lg:justify-end lg:pt-4"
      >
        <m.div
          animate={{ y: [-12, 12, -12] }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="relative h-[min(52vw,300px)] w-[min(46vw,260px)] bg-transparent sm:h-[320px] sm:w-[280px] lg:h-[360px] lg:w-[300px]"
        >
          <img
            src={homeImages.selectedWorkHero.src}
            alt={homeImages.selectedWorkHero.alt}
            width={347}
            height={815}
            decoding="async"
            fetchPriority="high"
            className="pointer-events-none h-full w-full select-none object-contain object-center"
          />
        </m.div>
      </AnimatedReveal>
    </div>
  );
}
