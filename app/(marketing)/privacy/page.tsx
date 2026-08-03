import type { Metadata } from "next";

import { LegalPage } from "@/components/pages/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Statement",
  description: `Privacy Statement for ${company.name}.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Statement" effectiveDate="August 3, 2026">
      <section className="space-y-6 text-sm leading-relaxed text-muted md:text-base">
        <p>
          GM Lawason Studios (&quot;we&quot;, &quot;us&quot;) explains here how we collect,
          use, and protect your information when you use our website and services.
        </p>

        <div>
          <h2 className="font-display text-2xl text-foreground">
            Information we collect
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Contact details you submit (name, email, message)</li>
            <li>Google sign-in data (name, email, profile photo) if you authenticate</li>
            <li>Usage data (browser, pages visited, device type)</li>
            <li>Theme preferences stored in local storage</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-foreground">
            How we use it
          </h2>
          <p className="mt-3">
            To respond to inquiries, operate the website, authenticate users, improve
            our services, and maintain security. We do not sell personal information.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-foreground">
            Your rights
          </h2>
          <p className="mt-3">
            You may request access, correction, or deletion of your data by contacting
            us on{" "}
            <a
              href={company.social.instagram}
              className="text-accent hover:brightness-110"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </section>
    </LegalPage>
  );
}
