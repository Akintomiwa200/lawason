import type { Metadata } from "next";

import { LegalPage } from "@/components/pages/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and Conditions for ${company.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" effectiveDate="August 3, 2026">
      <section className="space-y-6 text-sm leading-relaxed text-muted md:text-base">
        <p>
          By using the GM Lawason Studios website, you agree to these terms. If you
          do not agree, please discontinue use of our services.
        </p>

        <div>
          <h2 className="font-display text-2xl text-foreground">
            Services
          </h2>
          <p className="mt-3">
            We provide filmmaking, cinematography, special effect lighting, and
            related production services. Website content is informational until
            confirmed in a separate agreement.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-foreground">
            Intellectual property
          </h2>
          <p className="mt-3">
            All site content is owned by GM Lawason Studios or its licensors. You may
            not copy or redistribute content without written permission.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-foreground">
            Governing law
          </h2>
          <p className="mt-3">
            These terms are governed by the laws of the Federal Republic of Nigeria.
          </p>
        </div>
      </section>
    </LegalPage>
  );
}
