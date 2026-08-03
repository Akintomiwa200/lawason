"use client";

import { useEffect, useState } from "react";

type DottedMapInstance = {
  addPin: (pin: {
    lat: number;
    lng: number;
    svgOptions?: { color?: string; radius?: number };
  }) => void;
  getSVG: (options: {
    shape?: "circle" | "hexagon";
    backgroundColor?: string;
    color?: string;
    radius?: number;
  }) => string;
};

type DottedMapConstructor = new (settings: {
  height?: number;
  grid?: "vertical" | "diagonal";
}) => DottedMapInstance;

function resolveDottedMapConstructor(mod: unknown): DottedMapConstructor {
  const record = mod as { default?: unknown };

  if (typeof record.default === "function") {
    return record.default as DottedMapConstructor;
  }

  if (
    record.default &&
    typeof record.default === "object" &&
    typeof (record.default as { default?: unknown }).default === "function"
  ) {
    return (record.default as { default: DottedMapConstructor }).default;
  }

  if (typeof mod === "function") {
    return mod as DottedMapConstructor;
  }

  throw new Error("Could not resolve DottedMap constructor from dotted-map");
}

const TEAM_LOCATIONS = [
  { lat: 6.6018, lng: 3.3515, color: "#16a34a" },
  { lat: 6.5244, lng: 3.3792, color: "#0a0a0a" },
  { lat: 9.0765, lng: 7.3986, color: "#16a34a" },
  { lat: 4.8156, lng: 7.0498, color: "#22c55e" },
  { lat: 5.6037, lng: -0.187, color: "#16a34a" },
  { lat: 6.1366, lng: 1.2224, color: "#22c55e" },
  { lat: 25.2048, lng: 55.2708, color: "#0a0a0a" },
  { lat: 51.5074, lng: -0.1278, color: "#16a34a" },
];

function buildMapSvg(DottedMap: DottedMapConstructor, dotColor: string) {
  const map = new DottedMap({ height: 80, grid: "diagonal" });

  for (const location of TEAM_LOCATIONS) {
    map.addPin({
      lat: location.lat,
      lng: location.lng,
      svgOptions: { color: location.color, radius: 1.15 },
    });
  }

  return map.getSVG({
    shape: "circle",
    backgroundColor: "transparent",
    color: dotColor,
    radius: 0.32,
  });
}

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

export function AboutWorldMap() {
  const isDark = useIsDarkTheme();
  const dotColor = isDark ? "#404040" : "#d8d8d8";
  const [svgMap, setSvgMap] = useState("");

  useEffect(() => {
    let cancelled = false;

    import("dotted-map")
      .then((mod) => {
        if (cancelled) return;

        const DottedMap = resolveDottedMapConstructor(mod);
        setSvgMap(buildMapSvg(DottedMap, dotColor));
      })
      .catch((error) => {
        console.error("Failed to load dotted-map:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [dotColor]);

  if (!svgMap) {
    return (
      <div
        className="h-[280px] animate-pulse rounded-[20px] bg-[var(--lp-card-alt)] md:h-[380px]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="w-full transition-opacity duration-300 [&>svg]:mx-auto [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-[1100px]"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgMap }}
    />
  );
}
