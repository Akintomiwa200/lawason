import dynamic from "next/dynamic";

import { company } from "@/lib/company";

const AboutWorldMap = dynamic(
  () =>
    import("@/components/about/about-world-map").then((mod) => mod.AboutWorldMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[280px] animate-pulse rounded-[20px] bg-[var(--lp-card-alt)] md:h-[380px]"
        aria-hidden="true"
      />
    ),
  },
);

export function AboutGlobal() {
  return (
    <section className="bg-[var(--lp-bg)] py-20 transition-colors duration-300 md:py-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="max-w-xl text-left">
          <h2 className="font-display text-[2rem] leading-[1.15] tracking-tight text-[var(--lp-text)] md:text-[2.75rem] lg:text-[3rem]">
            Based in <span className="font-bold text-accent">Lagos</span>, reaching sets
            across Nigeria.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-[var(--lp-text-muted)] md:text-base">
            From {company.location}, {company.name} serves Nollywood productions and
            collaborations across the region — on location, on set, and on screen.
          </p>
        </div>

        <div className="relative mt-12 md:mt-16">
          <AboutWorldMap />
        </div>
      </div>
    </section>
  );
}
