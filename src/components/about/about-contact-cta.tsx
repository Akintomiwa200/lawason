import Link from "next/link";
import { UserRound } from "lucide-react";

import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

const SOCIAL_PILLS = [
  {
    label: "Instagram",
    href: company.social.instagram,
    dark: false,
    className: "left-[10%] top-[26%] -rotate-[6deg]",
  },
  {
    label: "LinkedIn",
    href: company.social.linkedin,
    dark: true,
    className: "right-[8%] top-[34%] rotate-[5deg]",
  },
  {
    label: "Instagram",
    href: company.social.instagram,
    dark: true,
    className: "left-[44%] top-[54%] -rotate-[3deg] hidden lg:block",
  },
  {
    label: "LinkedIn",
    href: company.social.linkedin,
    dark: false,
    className: "right-[34%] top-[18%] rotate-[4deg] hidden lg:block",
  },
] as const;

function ConsultBadge({
  variant,
  className,
  reverse,
}: {
  variant: "brand" | "light";
  className?: string;
  reverse?: boolean;
}) {
  const isBrand = variant === "brand";
  const ringId = `consult-ring-${variant}-${reverse ? "r" : "f"}`;

  return (
    <div
      className={cn(
        "relative flex h-[88px] w-[88px] items-center justify-center sm:h-[100px] sm:w-[100px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 200 200"
        className={cn(
          "absolute inset-0 h-full w-full",
          reverse
            ? "animate-[spin_22s_linear_infinite_reverse]"
            : "animate-[spin_18s_linear_infinite]",
        )}
        aria-hidden
      >
        <defs>
          <path
            id={ringId}
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            fill="none"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="13"
          fontWeight="600"
          letterSpacing="3"
          className={isBrand ? "text-brand-green" : "text-brand-green-light"}
        >
          <textPath href={`#${ringId}`} startOffset="0">
            BOOK THE STUDIO • BOOK THE STUDIO • BOOK THE STUDIO •
          </textPath>
        </text>
      </svg>

      <div
        className={cn(
          "relative z-[1] flex h-11 w-11 items-center justify-center rounded-full shadow-float sm:h-12 sm:w-12",
          isBrand ? "bg-brand-green text-white" : "bg-white text-brand-green",
        )}
      >
        <UserRound className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function SocialPill({
  label,
  href,
  dark,
  className,
}: {
  label: string;
  href: string;
  dark: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex rounded-full border px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-transform hover:scale-105 sm:text-xs",
        dark
          ? "border-brand-green bg-brand-green text-white shadow-marketing hover:bg-brand-green/90"
          : "border-brand-green/15 bg-white text-brand-green shadow-sm hover:border-brand-green/30 hover:bg-brand-green/5",
        className,
      )}
    >
      {label}
    </a>
  );
}

export function AboutContactCta({
  variant = "about",
  hideSocialDecor = false,
}: {
  variant?: "about" | "contact";
  hideSocialDecor?: boolean;
}) {
  const year = new Date().getFullYear();
  const isContactPage = variant === "contact";

  const heading = (
    <>
      {isContactPage ? "GET IN" : "CONTACTS"}{" "}
      <span aria-hidden className="inline-block translate-y-[-0.06em] text-brand-highlight">
        ✦
      </span>{" "}
      {isContactPage ? "TOUCH" : "US"}
    </>
  );

  return (
    <section
      className="bg-marketing-bg pb-section lg:pb-24"
      aria-labelledby="about-contact-heading"
    >
      {!hideSocialDecor ? (
        <div className="container-content max-w-[1400px] py-14 lg:py-16">
          <div className="flex flex-wrap items-center justify-center gap-3 md:hidden">
            <SocialPill
              label="Instagram"
              href={company.social.instagram}
              dark={false}
            />
            <SocialPill
              label="LinkedIn"
              href={company.social.linkedin}
              dark
            />
          </div>

          <div className="relative mx-auto hidden min-h-[280px] max-w-4xl md:block lg:min-h-[320px]">
            <ConsultBadge variant="brand" reverse className="absolute left-[4%] top-[38%]" />
            <ConsultBadge variant="light" className="absolute right-[6%] top-[30%]" />
            <ConsultBadge
              variant="brand"
              className="absolute left-[40%] top-[6%] hidden lg:flex"
            />

            {SOCIAL_PILLS.map(({ label, href, dark, className }) => (
              <div key={`${label}-${className}`} className={cn("absolute z-[1]", className)}>
                <SocialPill label={label} href={href} dark={dark} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="container-content max-w-[1400px]">
        <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-green to-brand-green-dark" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.12) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-green-light/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-black/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-highlight/15 blur-3xl"
          />
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-[55%] text-white/[0.07] lg:w-[45%]"
            viewBox="0 0 520 340"
            preserveAspectRatio="none"
          >
            <path d="M80 0C200 24 340 48 520 120V340H0V0H80Z" fill="currentColor" />
            <path
              d="M180 0C300 64 420 88 520 180V340H120V0H180Z"
              fill="currentColor"
              opacity="0.65"
            />
          </svg>

          <div className="relative text-white">
            <div className="border-b border-white/15 px-6 sm:px-8 lg:px-10">
              <div className="grid grid-cols-1 gap-3 py-5 text-[0.65rem] leading-relaxed text-white/70 sm:grid-cols-3 sm:gap-4 sm:text-[0.7rem]">
                <p className="text-center sm:text-left">
                  Reach out for filmmaking, gaffer services,
                  <br />
                  and special effect lighting.
                </p>
                <p className="text-center font-semibold uppercase tracking-[0.12em] text-brand-highlight">
                  Let&apos;s stay connected
                </p>
                <p className="text-center sm:text-right">
                  © {year} {company.shortName}
                </p>
              </div>
            </div>

            <div className="overflow-hidden px-6 pt-4 pb-8 sm:px-8 sm:pb-10 lg:px-10">
              {isContactPage ? (
                <h2
                  id="about-contact-heading"
                  className="text-center font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[0.95] font-black tracking-[-0.03em] text-white uppercase select-none"
                >
                  {heading}
                </h2>
              ) : (
                <Link
                  href="/contact"
                  id="about-contact-heading"
                  className="block text-center font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[0.95] font-black tracking-[-0.03em] text-white uppercase transition-opacity select-none hover:opacity-90"
                >
                  {heading}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
