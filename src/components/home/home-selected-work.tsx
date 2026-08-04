"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { workItems } from "@/lib/company";
import { homeImages } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const featuredWork = [
  {
    ...workItems[0],
    number: 1,
    image: { ...homeImages.portrait, className: "aspect-[4/5]" },
    layout: "image-first" as const,
  },
  {
    ...workItems[1],
    number: 2,
    image: { ...homeImages.crew, className: "aspect-[4/3]" },
    layout: "text-first" as const,
  },
  {
    ...workItems[2],
    number: 3,
    image: { ...homeImages.lighting, className: "aspect-[4/5]" },
    layout: "image-first" as const,
  },
];

function WorkCard({
  number,
  tag,
  title,
  description,
  href,
  className,
}: {
  number: number;
  tag: string;
  title: string;
  description: string;
  href: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "relative flex min-h-[11rem] flex-col justify-end rounded-[1.25rem] bg-surface p-6 sm:min-h-[12rem] sm:p-7",
        className,
      )}
    >
      <span className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-medium text-muted">
        {number}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        {tag}
      </span>
      <h3 className="mt-2 pr-8 text-lg font-bold tracking-[-0.01em] text-foreground sm:text-xl">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-semibold text-accent transition hover:brightness-110"
      >
        View project →
      </Link>
    </article>
  );
}

function WorkImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[1.25rem]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

export function HomeSelectedWork() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
            Selected Work
          </span>
          <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.03em] text-foreground">
            Productions we{" "}
            <em className="font-serif font-normal italic tracking-[-0.02em]">
              craft
            </em>{" "}
            with purpose.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Including The Gaffer Man Show — conversations with industry leaders
            about craft, leadership, and life on set.
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {featuredWork.map((item) => (
            <RevealItem key={item.slug} className="flex flex-col gap-4 md:gap-5">
              {item.layout === "image-first" ? (
                <>
                  <WorkImage
                    src={item.image.src}
                    alt={item.image.alt}
                    className={item.image.className}
                  />
                  <WorkCard
                    number={item.number}
                    tag={item.tag}
                    title={item.title}
                    description={item.description}
                    href={`/work#${item.slug}`}
                  />
                </>
              ) : (
                <>
                  <WorkCard
                    number={item.number}
                    tag={item.tag}
                    title={item.title}
                    description={item.description}
                    href={`/work#${item.slug}`}
                  />
                  <WorkImage
                    src={item.image.src}
                    alt={item.image.alt}
                    className={item.image.className}
                  />
                </>
              )}
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.1} className="mt-10 flex justify-center md:mt-12">
          <Link
            href="/work"
            className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            View all work
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
