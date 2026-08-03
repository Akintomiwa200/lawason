import type { Metadata } from "next";

import {
  CtaBanner,
  PageHero,
  PageShell,
} from "@/components/pages/page-sections";
import { company, workItems } from "@/lib/company";

export const metadata: Metadata = {
  title: "Work",
  description: `Explore productions, shows, and collaborations from ${company.name} — including The Gaffer Man Show and Nollywood lighting projects.`,
};

export default function WorkPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Portfolio"
        title="Work that moves from set to screen."
        description="From The Gaffer Man Show to specialist lighting teams on Nollywood productions — explore the studio's projects, collaborations, and media initiatives."
      />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-6">
          {workItems.map((item) => (
            <article
              key={item.slug}
              id={item.slug}
              className="scroll-mt-28 grid gap-6 rounded-[1.75rem] border border-border bg-surface p-8 md:grid-cols-[1fr_1.4fr] md:p-10"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                  {item.category}
                </span>
                <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
                  {item.title}
                </h2>
                <span className="mt-4 inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                  {item.tag}
                </span>
              </div>
              <p className="text-base leading-relaxed text-muted md:text-lg">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Follow the studio on Instagram"
        description="Behind-the-scenes content, set updates, and new episodes from The Gaffer Man Show."
      />
    </PageShell>
  );
}
