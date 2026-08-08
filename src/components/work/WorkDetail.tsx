"use client";

import Image from "next/image";
import Link from "next/link";

import { company } from "@/lib/company";
import { AnimatedReveal } from "@/components/selected-work/AnimatedReveal";
import { FloatingBadge } from "@/components/selected-work/FloatingBadge";

import type { PortfolioWorkDetail } from "./data";
import { portfolioWorks } from "./data";

interface WorkDetailProps {
  work: PortfolioWorkDetail;
}

export function WorkDetail({ work }: WorkDetailProps) {
  const related = portfolioWorks.filter((item) => item.slug !== work.slug).slice(0, 2);

  return (
    <>
      <section className="bg-[#F6F3EF] dark:bg-background">
        <div className="mx-auto max-w-[1450px] px-6 pb-16 pt-28 sm:px-8 md:pb-20 md:pt-36 lg:px-10 lg:pt-40">
          <AnimatedReveal>
            <Link
              href="/work"
              className="inline-flex items-center text-sm font-medium text-[#6b6560] transition hover:text-accent dark:text-muted"
            >
              ← All work
            </Link>
          </AnimatedReveal>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14">
            <AnimatedReveal y={50}>
              <FloatingBadge label={work.category} />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                {work.categoryLabel}
              </p>
              <h1 className="mt-4 max-w-[16ch] text-[40px] font-medium leading-[0.95] tracking-[-0.04em] text-[#1a1a1a] dark:text-foreground md:text-[52px] lg:text-[64px]">
                {work.title}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-[1.75] text-[#6b6560] dark:text-muted md:text-[17px]">
                {work.description}
              </p>
            </AnimatedReveal>

            <AnimatedReveal delay={0.1} y={50}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#e8e2db] bg-[#edeae6] shadow-[0_18px_48px_rgba(26,22,18,0.08)] dark:border-border dark:bg-surface-elevated">
                <Image
                  src={work.image}
                  alt={work.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-[0.98] contrast-[1.05]"
                />
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-6 sm:px-8 lg:px-10">
          <AnimatedReveal>
            <h2 className="font-display text-2xl font-medium tracking-[-0.03em] text-foreground md:text-3xl">
              About this project
            </h2>
          </AnimatedReveal>

          <div className="mt-6 space-y-5">
            {work.body.map((paragraph, index) => (
              <AnimatedReveal key={paragraph} delay={index * 0.06} y={30}>
                <p className="text-base leading-[1.8] text-muted md:text-[17px]">
                  {paragraph}
                </p>
              </AnimatedReveal>
            ))}
          </div>

          <AnimatedReveal delay={0.12} className="mt-10">
            <ul className="grid gap-3 sm:grid-cols-3">
              {work.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground"
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle shadow-[0_0_10px_var(--glow)]" />
                  {highlight}
                </li>
              ))}
            </ul>
          </AnimatedReveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border bg-[#F6F3EF] py-16 dark:bg-background md:py-24">
          <div className="mx-auto max-w-[1450px] px-6 sm:px-8 lg:px-10">
            <AnimatedReveal className="mb-10">
              <h2 className="font-display text-2xl font-medium tracking-[-0.03em] text-[#1a1a1a] dark:text-foreground md:text-3xl">
                More from {company.shortName}
              </h2>
            </AnimatedReveal>

            <div className="grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <AnimatedReveal key={item.slug} y={40}>
                  <Link
                    href={`/work/${item.slug}`}
                    className="group flex items-center gap-5 rounded-[22px] border border-[#e8e2db] bg-[#F8F6F3] p-4 transition hover:border-accent/30 dark:border-border dark:bg-surface sm:p-5"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="112px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                        {item.category}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1a1a1a] dark:text-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
