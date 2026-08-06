import Link from "next/link";

import { partners } from "@/lib/partners";

function PartnerRowIcon({ id }: { id: (typeof partners)[number]["id"] }) {
  const className = "h-3.5 w-3.5 shrink-0 text-muted";

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

export function PartnerRow() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 md:mt-6 md:gap-x-5">
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
            <span className="text-[10px] font-medium text-muted sm:text-xs">{label}</span>
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
          <span key={partner.id} className="inline-flex items-center gap-2">
            {content}
          </span>
        );
      })}
    </div>
  );
}
