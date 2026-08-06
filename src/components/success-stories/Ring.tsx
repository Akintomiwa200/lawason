"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

import { StoryCard } from "./StoryCard";
import type { RingConfig, SceneTheme, StoryImage } from "./types";

interface RingProps {
  config: RingConfig;
  images: StoryImage[];
  paused: boolean;
  theme: SceneTheme;
}

export function Ring({ config, images, paused, theme }: RingProps) {
  const groupRef = useRef<THREE.Group>(null);

  const cards = useMemo(
    () =>
      images.map((image, index) => {
        const angle = (index / config.count) * Math.PI * 2;
        // XY plane — circle faces the camera on +Z
        const x = Math.sin(angle) * config.radius;
        const y = Math.cos(angle) * config.radius;

        return (
          <StoryCard
            key={`${image.src}-${index}`}
            image={image}
            index={index}
            position={[x, y, 0]}
            config={config}
            theme={theme}
          />
        );
      }),
    [config, images, theme],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (!paused) {
      groupRef.current.rotation.z -= (delta * Math.PI * 2) / config.rotationDuration;
    }

    groupRef.current.position.z =
      Math.sin(state.clock.elapsedTime * config.floatSpeed) * config.floatAmplitude;
  });

  return <group ref={groupRef}>{cards}</group>;
}
