"use client";

import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { homeImages } from "@/lib/home-images";

function GalleryFrame({
  src,
  alt,
  sizes,
  ratio,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  ratio: string;
  priority?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-sm"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover object-center"
        priority={priority}
      />
    </div>
  );
}

export function SpecializingSection() {
  return (
    <section className="bg-background px-6 py-20 md:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.55em] text-muted md:text-[11px]">
          Specializing in
        </p>
        <h2 className="mx-auto mt-7 font-display text-[2rem] leading-[1.14] text-foreground sm:text-[2.75rem] md:text-[3.35rem] md:leading-[1.1]">
          Filmmaking, Cinematography
          <br />
          &amp; Special Effect Lighting
        </h2>
      </Reveal>

      <Reveal className="mx-auto mt-14 w-full max-w-5xl sm:mt-16 md:mt-20">
        <div className="grid gap-4 sm:gap-5 md:gap-6">
          <GalleryFrame
            src={homeImages.portrait.src}
            alt={homeImages.portrait.alt}
            ratio="16 / 6"
            sizes="(max-width: 1024px) 100vw, 64rem"
            priority
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <GalleryFrame
              src={homeImages.lighting.src}
              alt={homeImages.lighting.alt}
              ratio="16 / 10"
              sizes="(max-width: 1024px) 50vw, 32rem"
            />
            <GalleryFrame
              src={homeImages.cinematographer.src}
              alt={homeImages.cinematographer.alt}
              ratio="16 / 10"
              sizes="(max-width: 1024px) 50vw, 32rem"
            />
          </div>
          <GalleryFrame
            src={homeImages.crew.src}
            alt={homeImages.crew.alt}
            ratio="16 / 6"
            sizes="(max-width: 1024px) 100vw, 64rem"
          />
        </div>
      </Reveal>
    </section>
  );
}
