"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { homeImages } from "@/lib/home-images";
import { partners } from "@/lib/partners";

const RING_COUNT = 14;

const ringImages = Array.from({ length: RING_COUNT }, (_, index) => {
  const pool = [
    homeImages.director,
    homeImages.portrait,
    homeImages.lighting,
    homeImages.cinematographer,
    homeImages.crew,
  ];

  return pool[index % pool.length];
});

function cardDepth(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return (1 + Math.cos(rad)) / 2;
}

function PartnerRowIcon({ id }: { id: (typeof partners)[number]["id"] }) {
  const className = "h-4 w-4 shrink-0 text-muted";

  switch (id) {
    case "amriona-light-team":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
        </svg>
      );
    case "gaffer-man-show":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
        </svg>
      );
    case "film-academy":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 2.18L18.09 9 12 12.82 5.91 9 12 5.18zM3 13.5V19l9 5 9-5v-5.5l-9 4.9-9-4.9z" />
        </svg>
      );
    case "national-film-institute":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z" />
        </svg>
      );
    case "nollywood-lighting":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
        </svg>
      );
  }
}

function ImageRing() {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const radius = isDesktop ? 340 : 210;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    >
      <div
        className="relative h-full w-full max-w-[1100px]"
        style={{
          perspective: "1200px",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 11%, black 89%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 11%, black 89%, transparent 100%)",
        }}
      >
        <div
          className="absolute left-1/2 top-[52%] h-0 w-0 [transform-style:preserve-3d]"
          style={{ transform: "translate(-50%, -50%) rotateX(14deg)" }}
        >
          <m.div
            className="relative h-0 w-0 [transform-style:preserve-3d]"
            animate={prefersReducedMotion ? undefined : { rotateY: 360 }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 48, ease: "linear", repeat: Infinity }
            }
          >
            {ringImages.map((image, index) => {
              const angle = (360 / RING_COUNT) * index;
              const depth = cardDepth(angle);
              const opacity = 0.32 + depth * 0.68;
              const scale = 0.78 + depth * 0.22;

              return (
                <div
                  key={`${image.src}-${index}`}
                  className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <div
                    className="relative h-[7.5rem] w-[5.625rem] overflow-hidden rounded-2xl shadow-[0_18px_44px_rgba(0,0,0,0.14)] [backface-visibility:hidden] sm:h-[8.5rem] sm:w-[6.375rem] md:h-[9.75rem] md:w-[7.25rem]"
                    style={{
                      opacity,
                      transform: `translate(-50%, -50%) scale(${scale})`,
                    }}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 108px, 140px"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </m.div>
        </div>
      </div>
    </div>
  );
}

export function HomeSuccessStories() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-28">
      <div className="relative mx-auto h-[min(105vw,680px)] w-full max-w-7xl px-6 md:h-[780px]">
        <ImageRing />

        <Reveal className="absolute left-1/2 top-1/2 z-10 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
            Trustworthy
          </span>

          <h2 className="mt-5 font-display text-[clamp(1.85rem,5vw,3.35rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground md:mt-6">
            <em className="font-serif font-normal italic">2010+</em> success
            stories.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:mt-4 sm:text-[15px]">
            A proven track record of delivering cinematic lighting and
            production craft across Nollywood sets and global collaborations.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:mt-9 md:gap-x-7">
            {partners.map((partner) => {
              const label =
                partner.id === "film-academy"
                  ? "GM Academy"
                  : partner.id === "national-film-institute"
                    ? "NFI Jos"
                    : partner.name;

              const content = (
                <>
                  <PartnerRowIcon id={partner.id} />
                  <span className="text-xs font-medium text-muted sm:text-sm">
                    {label}
                  </span>
                </>
              );

              if ("href" in partner && partner.href) {
                return (
                  <Link
                    key={partner.id}
                    href={partner.href}
                    className="inline-flex items-center gap-2 transition hover:text-accent"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <span
                  key={partner.id}
                  className="inline-flex items-center gap-2"
                >
                  {content}
                </span>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
