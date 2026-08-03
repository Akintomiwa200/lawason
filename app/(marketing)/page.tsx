import Link from "next/link";

import { AboutContactCta } from "@/components/about/about-contact-cta";
import { HomeHero } from "@/components/home/home-hero";
import { HomeWhatWeDo } from "@/components/home/home-what-we-do";
import { SpecializingSection } from "@/components/home/specializing-gallery";
import { PageShell, SectionHeading } from "@/components/pages/page-sections";
import { workItems } from "@/lib/company";

export default function HomePage() {
  const featuredWork = workItems.slice(0, 3);

  return (
    <PageShell hideSpotlight>
      <HomeHero />

      <SpecializingSection />

      <HomeWhatWeDo />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <SectionHeading
          eyebrow="Selected work"
          title="Productions, shows & collaborations"
          description="Including The Gaffer Man Show — conversations with industry leaders about craft and leadership."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuredWork.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col rounded-2xl border border-border bg-surface-elevated p-6"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                {item.tag}
              </span>
              <h3 className="mt-3 font-display text-2xl text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              <Link
                href={`/work#${item.slug}`}
                className="mt-5 text-sm font-semibold text-accent"
              >
                View project →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <AboutContactCta />
    </PageShell>
  );
}
