"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";

import { Lights } from "./Lights";
import { Ring } from "./Ring";
import {
  buildRingImages,
  getCameraSettings,
  getRingConfig,
  getSceneTheme,
} from "./types";
import type { ResolvedTheme, SceneSize } from "./types";

interface SceneProps {
  size: SceneSize;
  paused: boolean;
  theme: ResolvedTheme;
}

function SceneContent({ size, paused, theme }: SceneProps) {
  const config = useMemo(() => getRingConfig(size), [size.width, size.height]);
  const images = useMemo(() => buildRingImages(), []);
  const sceneTheme = useMemo(() => getSceneTheme(theme), [theme]);

  return (
    <>
      <Lights theme={sceneTheme} />
      <Suspense fallback={null}>
        <Ring
          config={config}
          images={images}
          paused={paused}
          theme={sceneTheme}
        />
      </Suspense>
    </>
  );
}

export function Scene({ size, paused, theme }: SceneProps) {
  const camera = useMemo(() => getCameraSettings(size.width), [size.width]);
  const dpr =
    size.width > 0 && size.width < 768
      ? 1
      : Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          1.5,
        );

  return (
    <Canvas
      className="block h-full w-full"
      dpr={dpr}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{
        position: camera.position,
        fov: camera.fov,
        near: 0.1,
        far: 100,
      }}
      style={{ background: "transparent" }}
    >
      <SceneContent size={size} paused={paused} theme={theme} />
    </Canvas>
  );
}
