"use client";

import { useEffect, useState } from "react";

function getInitialMatch(query: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => getInitialMatch(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = () => setMatches(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
