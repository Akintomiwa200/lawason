import type { Metadata } from "next";

import {
  CtaBanner,
  PageHero,
  PageShell,
  SectionHeading,
} from "@/components/pages/page-sections";
import { company, services } from "@/lib/company";

export const metadata: Metadata = {
  title: "Services",
  description: `Production services from ${company.name} — filmmaking, cinematography, special effect lighting, scriptwriting, and production design.`,
};

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Studio services"
        title="Every frame lit with intention."
        description="GM Lawason Studios delivers full production capabilities rooted in real Nollywood set experience — from gaffer services and special effect lighting to cinematography and script development."
      />

      <section className="mx-auto w-full max-w-6xl space-y-8 px-6 pb-20">
        {services.map((service, index) => (
          <article
            key={service.slug}
            id={service.slug}
            className="scroll-mt-28 rounded-[1.75rem] border border-border bg-surface p-8 md:p-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <p className="font-display text-5xl text-accent/30">
                {String(index + 1).padStart(2, "0")}
              </p>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                {service.title}
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl text-foreground md:text-4xl">
              {service.summary}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
              {service.description}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {service.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface-elevated px-4 py-3 text-sm text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]" />
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-12">
        <SectionHeading
          eyebrow="On set"
          title="Built for the pace of Nollywood"
          description="Led by Godwin Lawani — light designer and gaffer since 2010 — the studio brings disciplined craft, fast problem-solving, and cinematic lighting to every production."
        />
      </section>

      <CtaBanner
        title="Need a gaffer or full production crew?"
        description="Tell us about your project and we'll match the right studio services to your shoot."
      />
    </PageShell>
  );
}
