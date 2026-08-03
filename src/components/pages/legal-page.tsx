import type { ReactNode } from "react";

import { PageHero, PageShell } from "@/components/pages/page-sections";

interface LegalPageProps {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}

export function LegalPage({ title, effectiveDate, children }: LegalPageProps) {
  return (
    <PageShell>
      <PageHero
        eyebrow={`Effective ${effectiveDate}`}
        title={title}
      />
      <article className="mx-auto max-w-3xl space-y-6 px-6 pb-20 text-sm leading-relaxed text-muted md:text-base">
        {children}
      </article>
    </PageShell>
  );
}
