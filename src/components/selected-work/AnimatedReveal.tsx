"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AnimatedRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function AnimatedReveal({
  children,
  className,
  delay = 0,
  y = 80,
}: AnimatedRevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}
