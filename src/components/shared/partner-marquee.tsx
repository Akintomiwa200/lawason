"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { partners } from "@/lib/partners";
import { cn } from "@/lib/utils";

function PartnerIcon({ id }: { id: (typeof partners)[number]["id"] }) {
  const icons: Record<(typeof partners)[number]["id"], ReactNode> = {
    "amriona-light-team": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
      </svg>
    ),
    "gaffer-man-show": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
      </svg>
    ),
    "film-academy": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 2.18L18.09 9 12 12.82 5.91 9 12 5.18zM3 13.5V19l9 5 9-5v-5.5l-9 4.9-9-4.9z" />
      </svg>
    ),
    "national-film-institute": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z" />
      </svg>
    ),
    "nollywood-lighting": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    ),
  };

  return icons[id];
}

function PartnerLogo({
  name,
  href,
  id,
  className,
}: {
  name: string;
  href?: string;
  id: (typeof partners)[number]["id"];
  className?: string;
}) {
  const content = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-accent">
        <PartnerIcon id={id} />
      </span>
      <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight md:text-base">
        {name}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex shrink-0 items-center gap-2.5 opacity-80 transition hover:opacity-100",
          className,
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center gap-2.5 opacity-80", className)}>
      {content}
    </div>
  );
}

function PartnerTrack({
  trackId,
  ariaHidden = false,
  className,
}: {
  trackId: string;
  ariaHidden?: boolean;
  className?: string;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {partners.map((partner) => (
        <PartnerLogo
          key={`${trackId}-${partner.id}`}
          id={partner.id}
          name={partner.name}
          href={"href" in partner ? partner.href : undefined}
          className={className}
        />
      ))}
    </div>
  );
}

interface PartnerMarqueeProps {
  fadeClassName?: string;
  itemClassName?: string;
  duration?: number;
}

export function PartnerMarquee({
  fadeClassName = "from-background",
  itemClassName,
  duration = 28,
}: PartnerMarqueeProps) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent sm:w-16",
          fadeClassName,
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l to-transparent sm:w-16",
          fadeClassName,
        )}
        aria-hidden="true"
      />

      <motion.div
        className="flex w-max items-center"
        animate={{ x: "-50%" }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <PartnerTrack trackId="a" className={itemClassName} />
        <PartnerTrack trackId="b" ariaHidden className={itemClassName} />
      </motion.div>
    </>
  );
}
