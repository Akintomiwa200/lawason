"use client";

import type { SceneTheme } from "./types";

interface LightsProps {
  theme: SceneTheme;
}

export function Lights({ theme }: LightsProps) {
  return (
    <>
      <ambientLight intensity={theme.ambientIntensity} color={theme.ambientColor} />
      <directionalLight
        color="#ffffff"
        intensity={theme.keyLightIntensity}
        position={[5, 8, 6]}
      />
      <directionalLight
        color={theme.resolved === "dark" ? "#d4d4d4" : "#f5efe6"}
        intensity={theme.fillLightIntensity}
        position={[-4, 3, -5]}
      />
      <pointLight
        color="#ffffff"
        intensity={theme.resolved === "dark" ? 0.28 : 0.18}
        position={[0, 2.5, 4]}
      />
    </>
  );
}
