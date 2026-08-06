"use client";

import dynamic from "next/dynamic";

import { company } from "@/lib/company";

import { ContactInfoCards } from "./ContactInfoCards";

const AboutWorldMap = dynamic(
  () =>
    import("@/components/about/about-world-map").then((mod) => mod.AboutWorldMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[280px] animate-pulse rounded-[20px] bg-surface-elevated md:h-[380px]"
        aria-hidden="true"
      />
    ),
  },
);

export function ContactVisitSection() {
  return (
    <section className="relative bg-background pb-24 pt-8 md:pb-28 md:pt-12">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
          Directly contact or visit us
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          {company.name} is your partner for filmmaking, cinematography, and
          special effect lighting — from studio conversations to on-set
          deployments across Nigeria.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-[1140px] px-6 md:mt-14">
        <AboutWorldMap />

        <div className="pointer-events-none absolute top-[18%] right-[8%] z-10 hidden w-[min(92%,17rem)] rounded-2xl border border-border bg-surface p-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)] md:block dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] lg:right-[12%]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Studio base
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            Ikorodu, Lagos
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {company.location}
          </p>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <ContactInfoCards />
      </div>
    </section>
  );
}
