"use client";

import Link from "next/link";
import { m } from "framer-motion";

export default function NotFoundContent() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--spotlight),transparent_70%)]" />

      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          Scene missing
        </p>
        <h1 className="mt-4 font-display text-7xl font-semibold text-foreground sm:text-8xl">
          404
        </h1>
        <p className="mt-4 text-lg text-muted text-balance">
          This frame was cut from the final edit. The page you&apos;re looking
          for doesn&apos;t exist or may have moved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Contact studio
          </Link>
        </div>
      </m.div>
    </section>
  );
}
