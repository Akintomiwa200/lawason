import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  hideSpotlight?: boolean;
}

export function PageShell({
  children,
  className,
  hideSpotlight = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "relative",
        hideSpotlight ? "overflow-visible" : "overflow-hidden",
        className,
      )}
    >
      {hideSpotlight ? null : (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,var(--spotlight),transparent_65%)]" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-24 md:pb-16 md:pt-28">
      {eyebrow ? (
        <p className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-balance text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.02em] text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

interface PrimaryButtonProps {
  href: string;
  children: ReactNode;
  external?: boolean;
}

export function PrimaryButton({ href, children, external }: PrimaryButtonProps) {
  const className =
    "inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children, external }: PrimaryButtonProps) {
  const className =
    "inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

interface CtaBannerProps {
  title: string;
  description: string;
}

export function CtaBanner({ title, description }: CtaBannerProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20">
      <div className="rounded-[2rem] border border-border bg-surface-elevated p-8 text-center md:p-12">
        <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-foreground md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton href="/book">Book a session</PrimaryButton>
          <SecondaryButton href="https://www.instagram.com/gmlawasonstudios/" external>
            Follow on Instagram
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
