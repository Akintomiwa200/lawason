"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";

import { NavbarCta } from "@/components/layout/navbar-cta";
import { NavLinks } from "@/components/layout/nav-links";
import { company } from "@/lib/company";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-4 pt-4 sm:px-6">
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-full",
          "border border-border/60 bg-surface/90 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl",
          "dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
        )}
      >
        <Link
          href="/"
          className="shrink-0 pl-2 font-display text-lg font-semibold tracking-tight text-accent"
        >
          {company.shortName}
        </Link>

        <NavLinks className="hidden lg:flex" />

        <div className="flex items-center gap-2 pr-1">
          <NavbarCta className="hidden sm:inline-flex" />

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-accent/10 lg:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <m.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "mx-auto mt-3 w-full max-w-5xl overflow-hidden rounded-3xl",
              "border border-border/60 bg-surface/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl",
              "dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] lg:hidden",
            )}
          >
            <div className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent/10 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-border/60 pt-4">
              <NavbarCta />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
