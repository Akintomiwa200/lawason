"use client";

import { Hero } from "./Hero";
import { WorkGrid } from "./WorkGrid";

export function SelectedWork() {
  return (
    <section className="bg-[#F6F3EF] dark:bg-background">
      <div className="mx-auto max-w-[1450px] px-6 pb-24 pt-28 sm:px-8 md:pb-28 md:pt-36 lg:px-10 lg:pt-40">
        <Hero />
        <WorkGrid />
      </div>
    </section>
  );
}

export { SelectedWork as HomeSelectedWork };
