import { company, founder } from "@/lib/company";
import { homeImages } from "@/lib/home-images";

const blobStyles = [
  "bg-accent/85 rounded-[45%_55%_70%_30%/40%_50%_50%_60%]",
  "bg-accent/70 rounded-[60%_40%_30%_70%/50%_60%_40%_50%]",
  "bg-foreground/80 rounded-[50%_50%_40%_60%/60%_40%_60%_40%]",
  "bg-accent/60 rounded-[40%_60%_55%_45%/55%_45%_55%_45%]",
];

const team = [
  {
    name: founder.name,
    role: founder.role,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&q=80",
    social: company.social,
  },
  {
    name: "Lighting & Gaffer Unit",
    role: "On-set specialists",
    image: homeImages.lighting.src,
    social: company.social,
  },
  {
    name: "Production Crew",
    role: "Film & camera",
    image: homeImages.crew.src,
    social: company.social,
  },
  {
    name: "Academy Faculty",
    role: "Training & media",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=750&fit=crop&q=80",
    social: company.social,
  },
];

function SocialLinks({ instagram, linkedin }: { instagram: string; linkedin: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <a
        href={instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] text-[var(--lp-text-muted)] transition hover:border-accent hover:text-accent"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] text-[var(--lp-text-muted)] transition hover:border-accent hover:text-accent"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </div>
  );
}

export function AboutTeam() {
  return (
    <section className="bg-[var(--lp-team-section-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="font-display text-[2rem] tracking-tight text-[var(--lp-text)] md:text-[2.75rem] lg:text-[3rem]">
            The <span className="font-bold text-accent">{company.shortName}</span> team.
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-[var(--lp-text-muted)] md:text-base">
            Led by {founder.name} — {founder.experience.toLowerCase()} — the studio
            brings gaffer work, cinematography, and production craft to every project.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {team.map((member, i) => (
            <article
              key={member.name}
              className="group flex flex-col overflow-hidden rounded-[20px] border border-[var(--lp-team-card-border)] bg-[var(--lp-team-card-bg)] shadow-[var(--lp-team-card-shadow)] transition hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--lp-team-image-bg)]">
                <div
                  className={`absolute bottom-6 left-1/2 h-[120px] w-[120px] -translate-x-1/2 ${blobStyles[i % blobStyles.length]}`}
                  aria-hidden="true"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative z-10 h-full w-full object-cover object-[center_15%] grayscale transition group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>

              <div className="flex flex-1 flex-col px-5 pb-6 pt-4 text-center">
                <h3 className="text-[17px] font-semibold tracking-tight text-[var(--lp-text)]">
                  {member.name}
                </h3>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--lp-text-muted)]">
                  {member.role}
                </p>
                <div className="my-5 h-px w-full bg-[var(--lp-team-card-border)]" />
                <SocialLinks
                  instagram={member.social.instagram}
                  linkedin={member.social.linkedin}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
