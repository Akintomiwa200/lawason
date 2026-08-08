"use client";

import { WorkCard } from "@/components/selected-work/WorkCard";

import { portfolioWorks } from "./data";

export function WorkPortfolio() {
  return (
    <div className="mt-[110px] grid grid-cols-1 gap-9 md:grid-cols-2">
      {portfolioWorks.map((work, index) => (
        <WorkCard key={work.id} work={work} index={index} />
      ))}
    </div>
  );
}
