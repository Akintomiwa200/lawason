import type { Metadata } from "next";

import { AboutContactCta } from "@/components/about/about-contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/pages/page-sections";
import { HomeSuccessStories } from "@/components/success-stories/HomeSuccessStories";
import { WorkPageContent } from "@/components/work";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Work",
  description: `Explore productions, shows, and collaborations from ${company.name} — including The Gaffer Man Show and Nollywood lighting projects.`,
};

export default function WorkPage() {
  return (
    <PageShell hideSpotlight>
      <WorkPageContent />

      <HomeSuccessStories />

      <Reveal>
        <AboutContactCta />
      </Reveal>
    </PageShell>
  );
}
