"use client";

import { Reveal } from "@/components/motion/reveal";

import { PartnerRow } from "./PartnerRow";

export function Overlay() {
  return (
    <Reveal className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-md flex-col items-center text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-surface/95 px-3 py-1 text-[10px] font-medium text-muted backdrop-blur-sm sm:text-xs">
          Trustworthy
        </span>

        <h2 className="mt-4 font-display text-[clamp(1.35rem,3.2vw,2.1rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:mt-5">
          <em className="font-serif font-normal italic">2010+</em> success stories.
        </h2>

        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted sm:mt-3 sm:text-sm">
          A proven track record of delivering cinematic lighting and production craft
          across Nollywood sets and global collaborations.
        </p>

        <PartnerRow />
      </div>
    </Reveal>
  );
}
