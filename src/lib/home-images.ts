export const homeImages = {
  lighting: {
    src: "/images/home/lighting.jpg",
    alt: "Film set lighting equipment",
  },
  cinematographer: {
    src: "/images/home/cinematographer.jpg",
    alt: "Cinematographer on set",
  },
  portrait: {
    src: "/images/home/portrait.jpg",
    alt: "Cinematic portrait lighting",
  },
  director: {
    src: "/images/home/director.jpg",
    alt: "Director reviewing a scene",
  },
  crew: {
    src: "/images/home/crew.jpg",
    alt: "Production crew on a film shoot",
  },
  selectedWorkHero: {
    src: "/images/selected-work/hero-hands.png",
    alt: "Decorative hands artwork",
  },
} as const;

export type HomeImageKey = keyof typeof homeImages;
