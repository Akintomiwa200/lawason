"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useResolvedTheme } from "@/hooks/use-theme";

import { Overlay } from "./Overlay";
import type { SceneSize } from "./types";

const Scene = dynamic(
  () => import("./Scene").then((module) => module.Scene),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HomeSuccessStories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const resolvedTheme = useResolvedTheme();
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState<SceneSize>({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [mounted]);

  const showScene = mounted && size.width > 0 && size.height > 0;

  return (
    <section className="relative flex h-[90vh] w-full items-center justify-center overflow-visible bg-background">
      <div
        ref={containerRef}
        className="relative aspect-square size-[min(90vh,100%,80rem)] max-w-7xl"
      >
        <div aria-hidden="true" className="absolute inset-0 z-0 overflow-visible">
          {showScene ? (
            <Scene
              key={resolvedTheme}
              size={size}
              paused={Boolean(prefersReducedMotion)}
              theme={resolvedTheme}
            />
          ) : null}
        </div>

        <Overlay />
      </div>
    </section>
  );
}
