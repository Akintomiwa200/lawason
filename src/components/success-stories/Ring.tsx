"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Timer, type Group } from "three";

import { StoryCard } from "./StoryCard";
import type { RingConfig, SceneTheme, StoryImage } from "./types";

interface RingProps {
  config: RingConfig;
  images: StoryImage[];
  paused: boolean;
  theme: SceneTheme;
}

export function Ring({ config, images, paused, theme }: RingProps) {
  const groupRef = useRef<Group>(null);
  const timer = useMemo(() => new Timer(), []);

  useEffect(() => () => void timer.dispose(), [timer]);

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

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return;
    }

    timer.update();

    if (!paused) {
      groupRef.current.rotation.z -= (delta * Math.PI * 2) / config.rotationDuration;
    }

    groupRef.current.position.z =
      Math.sin(timer.getElapsed() * config.floatSpeed) * config.floatAmplitude;
  });

  return <group ref={groupRef}>{cards}</group>;
}
