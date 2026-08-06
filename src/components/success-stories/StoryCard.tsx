"use client";

import { Billboard, RoundedBox, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

import type { RingConfig, SceneTheme, StoryImage } from "./types";

interface StoryCardProps {
  image: StoryImage;
  index: number;
  position: [number, number, number];
  config: RingConfig;
  theme: SceneTheme;
}

function StoryCardInner({ image, position, config, theme }: StoryCardProps) {
  const texture = useTexture(image.src);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const worldPosition = useRef(new THREE.Vector3());
  const cameraSpace = useRef(new THREE.Vector3());

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  useFrame(() => {
    if (!groupRef.current || !materialRef.current) {
      return;
    }

    groupRef.current.getWorldPosition(worldPosition.current);
    cameraSpace.current.copy(worldPosition.current);
    cameraSpace.current.applyMatrix4(camera.matrixWorldInverse);

    // Circle faces the viewer: bottom of ring (negative Y) is near, top is far
    const depthFactor = THREE.MathUtils.smoothstep(
      config.radius * 0.85,
      -config.radius * 0.85,
      cameraSpace.current.y,
    );

    const opacity = THREE.MathUtils.lerp(
      theme.minCardOpacity,
      theme.maxCardOpacity,
      depthFactor,
    );
    const scale = THREE.MathUtils.lerp(theme.minCardScale, 1, depthFactor);

    materialRef.current.opacity = opacity;
    materialRef.current.transparent = opacity < 0.995;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.renderOrder = Math.round((1 - depthFactor) * 100);
  });

  return (
    <group position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <group ref={groupRef}>
          <RoundedBox
            args={[config.cardWidth, config.cardHeight, config.cardDepth]}
            radius={config.cardRadius}
            smoothness={6}
          >
            <meshBasicMaterial
              ref={materialRef}
              map={texture}
              transparent
              toneMapped={false}
              opacity={1}
            />
          </RoundedBox>
        </group>
      </Billboard>
    </group>
  );
}

export function StoryCard(props: StoryCardProps) {
  return (
    <Suspense fallback={null}>
      <StoryCardInner {...props} />
    </Suspense>
  );
}
