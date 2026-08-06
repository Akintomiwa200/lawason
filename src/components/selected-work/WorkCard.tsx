"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";

import { FloatingBadge } from "./FloatingBadge";
import type { WorkItem } from "./data";

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface WorkCardProps {
  work: WorkItem;
  index: number;
}

export function WorkCard({ work, index }: WorkCardProps) {
  const href = `/work#${work.slug}`;

  return (
    <m.article
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link href={href} className="flex flex-col gap-[1em]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#e8e2db] bg-[#edeae6] shadow-[0_8px_30px_rgba(26,22,18,0.05)] transition-shadow duration-500 group-hover:shadow-[0_18px_48px_rgba(26,22,18,0.1)] dark:border-border dark:bg-surface-elevated dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
          <Image
            src={work.image}
            alt={work.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover brightness-[0.98] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 z-10">
            <FloatingBadge label={work.category} />
          </div>

          <span className="absolute bottom-0 right-0 z-10 flex h-14 w-14 items-center justify-center rounded-tl-[20px] border border-b-0 border-r-0 border-[#e8e2db] bg-white text-[#1a1a1a] shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-px dark:border-border dark:bg-surface dark:text-foreground sm:h-16 sm:w-16 sm:rounded-tl-[22px]">
            <ArrowUpRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
        </div>

        <div className="relative z-10 rounded-[22px] border border-[#e8e2db] bg-[#F8F6F3] px-5 py-4 shadow-[0_10px_28px_rgba(26,22,18,0.07)] transition-shadow duration-500 group-hover:shadow-[0_16px_36px_rgba(26,22,18,0.11)] dark:border-border dark:bg-surface dark:shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:px-6 sm:py-5">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#1a1a1a] dark:text-foreground sm:text-xl">
            {work.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#6b6560] dark:text-muted">
            {work.description}
          </p>
        </div>
      </Link>
    </m.article>
  );
}
