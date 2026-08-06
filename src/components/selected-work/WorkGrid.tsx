"use client";

import Link from "next/link";

import { AnimatedReveal } from "./AnimatedReveal";
import { WorkCard } from "./WorkCard";
import { works } from "./data";

export function WorkGrid() {
  return (
    <div className="mt-[110px]">
      <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
        {works.slice(0, 2).map((work, index) => (
          <WorkCard key={work.id} work={work} index={index} />
        ))}
      </div>

      <AnimatedReveal delay={0.3} className="mt-12 flex justify-center">
        <Link
          href="/work"
          className="inline-flex items-center rounded-full border border-[#ddd8d2] bg-white/70 px-7 py-3.5 text-sm font-medium text-[#1a1a1a] shadow-[0_4px_18px_rgba(26,22,18,0.04)] transition hover:border-[#c9c2ba] hover:bg-white dark:border-border dark:bg-surface dark:text-foreground"
        >
          View all work
        </Link>
      </AnimatedReveal>
    </div>
  );
}
