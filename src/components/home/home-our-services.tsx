"use client";

import Image from "next/image";

import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { homeImages } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const services = [
  {
    number: 1,
    title: "Filmmaking",
    description:
      "End-to-end production from concept to final cut — managed with cinematic intent from pre-production through post.",
    image: { ...homeImages.director, className: "aspect-[4/5]" },
    layout: "image-first" as const,
  },
  {
    number: 2,
    title: "Cinematography",
    description:
      "Visual storytelling with depth, mood, and motion — composition, movement, and lens choices that elevate every frame.",
    image: { ...homeImages.cinematographer, className: "aspect-[4/3]" },
    layout: "text-first" as const,
  },
  {
    number: 3,
    title: "Special Effect Lighting",
    description:
      "Professional gaffer and lighting design that transforms ordinary scenes into cinematic moments on set.",
    image: { ...homeImages.lighting, className: "aspect-[4/5]" },
    layout: "image-first" as const,
  },
];

function ServiceCard({
  number,
  title,
  description,
  className,
}: {
  number: number;
  title: string;
  description: string;
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
      <h3 className="pr-10 text-lg font-bold tracking-[-0.01em] text-foreground sm:text-xl">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}

function ServiceImage({
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

export function HomeOurServices() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
            Our Services
          </span>
          <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.03em] text-foreground">
            We{" "}
            <em className="font-serif font-normal italic tracking-[-0.02em]">
              illuminate
            </em>{" "}
            your stories.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Productions can create cinematic experiences that build trust and
            impact on every set and screen.
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {services.map((service) => (
            <RevealItem key={service.number} className="flex flex-col gap-4 md:gap-5">
              {service.layout === "image-first" ? (
                <>
                  <ServiceImage
                    src={service.image.src}
                    alt={service.image.alt}
                    className={service.image.className}
                  />
                  <ServiceCard
                    number={service.number}
                    title={service.title}
                    description={service.description}
                  />
                </>
              ) : (
                <>
                  <ServiceCard
                    number={service.number}
                    title={service.title}
                    description={service.description}
                  />
                  <ServiceImage
                    src={service.image.src}
                    alt={service.image.alt}
                    className={service.image.className}
                  />
                </>
              )}
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
