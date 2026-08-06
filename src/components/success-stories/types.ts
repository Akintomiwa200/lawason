import { homeImages } from "@/lib/home-images";

export const RING_COUNT = 9;

export interface StoryImage {
  src: string;
  alt: string;
}

export interface RingConfig {
  count: number;
  radius: number;
  cardWidth: number;
  cardHeight: number;
  cardDepth: number;
  cardRadius: number;
  rotationDuration: number;
  floatAmplitude: number;
  floatSpeed: number;
}

export interface SceneSize {
  width: number;
  height: number;
}

export function buildRingImages(): StoryImage[] {
  const pool = [
    homeImages.director,
    homeImages.portrait,
    homeImages.lighting,
    homeImages.cinematographer,
    homeImages.crew,
  ];

  return Array.from({ length: RING_COUNT }, (_, index) => pool[index % pool.length]);
}

/** World-space width visible at the camera distance for a given viewport. */
function getVisibleWorldSize(
  viewportWidth: number,
  viewportHeight: number,
  cameraZ: number,
  fov: number,
) {
  const fovRad = (fov * Math.PI) / 180;
  const worldHeight = 2 * cameraZ * Math.tan(fovRad / 2);
  const aspect = viewportWidth / Math.max(viewportHeight, 1);
  const worldWidth = worldHeight * aspect;

  return { worldWidth, worldHeight };
}

export function getCameraSettings(width: number) {
  const isMobile = width < 768;

  return {
    position: [0, 0, isMobile ? 9.2 : 10] as [number, number, number],
    fov: isMobile ? 46 : 42,
  };
}

/**
 * Ring radius is half the visible world width so diameter = width (complete circle).
 * Cards scale proportionally to the radius.
 */
export function getRingConfig(size: SceneSize): RingConfig {
  const camera = getCameraSettings(size.width);
  const cameraZ = camera.position[2];
  const { worldWidth, worldHeight } = getVisibleWorldSize(
    size.width,
    size.height,
    cameraZ,
    camera.fov,
  );

  // Leave room so cards at 3 & 9 o'clock don't clip past the viewport edges
  const available = Math.min(worldWidth, worldHeight) * 0.92;
  const maxRadius = available / 2;

  let cardWidth = ((2 * Math.PI * maxRadius) / RING_COUNT) * 0.5;
  let radius = maxRadius - cardWidth / 2;

  cardWidth = ((2 * Math.PI * radius) / RING_COUNT) * 0.5;
  const cardHeight = cardWidth * 1.36;
  const isMobile = size.width < 768;

  return {
    count: RING_COUNT,
    radius,
    cardWidth,
    cardHeight,
    cardDepth: cardWidth * 0.035,
    cardRadius: cardWidth * 0.075,
    rotationDuration: isMobile ? 52 : 48,
    floatAmplitude: radius * 0.012,
    floatSpeed: 0.4,
  };
}

export type ResolvedTheme = "light" | "dark";

export interface SceneTheme {
  resolved: ResolvedTheme;
  minCardOpacity: number;
  maxCardOpacity: number;
  minCardScale: number;
  shadowColor: string;
  shadowOpacity: number;
  ambientIntensity: number;
  ambientColor: string;
  keyLightIntensity: number;
  fillLightIntensity: number;
}

export function getSceneTheme(resolved: ResolvedTheme): SceneTheme {
  if (resolved === "dark") {
    return {
      resolved: "dark",
      minCardOpacity: 0.62,
      maxCardOpacity: 1,
      minCardScale: 0.84,
      shadowColor: "#000000",
      shadowOpacity: 0.22,
      ambientIntensity: 1.15,
      ambientColor: "#ffffff",
      keyLightIntensity: 0.72,
      fillLightIntensity: 0.34,
    };
  }

  return {
    resolved: "light",
    minCardOpacity: 0.48,
    maxCardOpacity: 1,
    minCardScale: 0.82,
    shadowColor: "#1a1208",
    shadowOpacity: 0.16,
    ambientIntensity: 0.95,
    ambientColor: "#fff8f0",
    keyLightIntensity: 0.58,
    fillLightIntensity: 0.26,
  };
}
