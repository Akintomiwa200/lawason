import { AboutPartners } from "@/components/about/about-partners";
import { AboutStats } from "@/components/about/about-stats";

import { WorkHero } from "./WorkHero";
import { WorkPortfolio } from "./WorkPortfolio";
import { WorkValues } from "./WorkValues";

export function WorkPageContent() {
  return (
    <>
      <section className="bg-[#F6F3EF] dark:bg-background">
        <div className="mx-auto max-w-[1450px] px-6 pb-24 pt-28 sm:px-8 md:pb-28 md:pt-36 lg:px-10 lg:pt-40">
          <WorkHero />
          <WorkPortfolio />
        </div>
      </section>

      <AboutPartners />
      <AboutStats />
      <WorkValues />
    </>
  );
}
