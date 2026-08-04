import { AboutContactCta } from "@/components/about/about-contact-cta";
import { HomeHero } from "@/components/home/home-hero";
import { HomeOurServices } from "@/components/home/home-our-services";
import { HomeSelectedWork } from "@/components/home/home-selected-work";
import { SpecializingSection } from "@/components/home/specializing-gallery";
import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/pages/page-sections";

export default function HomePage() {
  return (
    <PageShell hideSpotlight>
      <HomeHero />

      <SpecializingSection />

      <HomeOurServices />

      <HomeSelectedWork />

      <Reveal>
        <AboutContactCta />
      </Reveal>
    </PageShell>
  );
}
