"use client";

import { values } from "@/lib/company";

import { AnimatedReveal } from "@/components/selected-work/AnimatedReveal";

export function WorkValues() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1450px] px-6 sm:px-8 lg:px-10">
        <AnimatedReveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            Our approach
          </span>
          <h2 className="mt-5 font-display text-3xl font-medium tracking-[-0.03em] text-foreground md:text-4xl">
            Craft built on set, not in slides.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            Every project carries the same light-first discipline — from
            original shows to gaffer deployments across Nollywood.
          </p>
        </AnimatedReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {values.map((value, index) => (
            <AnimatedReveal
              key={value.title}
              delay={index * 0.08}
              y={40}
              className="rounded-[22px] border border-border bg-surface p-6 shadow-[0_10px_28px_rgba(26,22,18,0.05)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.2)] md:p-7"
            >
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {value.copy}
              </p>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
