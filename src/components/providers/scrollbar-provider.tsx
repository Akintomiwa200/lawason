"use client";

import { useEffect, type ReactNode } from "react";

const HIDE_DELAY_MS = 900;

interface ScrollbarProviderProps {
  children: ReactNode;
}

export function ScrollbarProvider({ children }: ScrollbarProviderProps) {
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const reveal = () => {
      document.documentElement.classList.add("scrollbar-active");
      document.body.classList.add("scrollbar-active");

      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      hideTimer = setTimeout(() => {
        document.documentElement.classList.remove("scrollbar-active");
        document.body.classList.remove("scrollbar-active");
      }, HIDE_DELAY_MS);
    };

    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("wheel", reveal, { passive: true });
    window.addEventListener("touchmove", reveal, { passive: true });
    window.addEventListener("keydown", (event) => {
      const scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];

      if (scrollKeys.includes(event.key)) {
        reveal();
      }
    });

    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      window.removeEventListener("scroll", reveal);
      window.removeEventListener("wheel", reveal);
      window.removeEventListener("touchmove", reveal);
      document.documentElement.classList.remove("scrollbar-active");
      document.body.classList.remove("scrollbar-active");
    };
  }, []);

  return children;
}
