"use client";

import Image from "next/image";

import { Reveal, RevealItem, RevealStagger, ScaleIn } from "@/components/motion/reveal";
import { homeImages } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const galleryItems = [
  {
    id: "lighting",
    ...homeImages.lighting,
    className:
      "left-0 top-[18%] z-[1] h-[4.75rem] w-[7.25rem] sm:h-[5.75rem] sm:w-[8.75rem] md:h-[7.25rem] md:w-[11rem]",
  },
  {
    id: "cinematographer",
    ...homeImages.cinematographer,
    className:
      "bottom-[2%] left-[7%] z-[2] h-[8rem] w-[5rem] sm:bottom-[4%] sm:left-[9%] sm:h-[10rem] sm:w-[6.25rem] md:h-[12.5rem] md:w-[7.75rem]",
  },
  {
    id: "portrait",
    ...homeImages.portrait,
    className:
      "left-1/2 top-[2%] z-[5] h-[11.5rem] w-[8.75rem] -translate-x-1/2 sm:h-[14.25rem] sm:w-[10.75rem] md:h-[18rem] md:w-[13.5rem]",
  },
  {
    id: "director",
    ...homeImages.director,
    className:
      "top-0 right-[9%] z-[3] h-[7.5rem] w-[4.75rem] sm:right-[11%] sm:h-[9.25rem] sm:w-[5.75rem] md:h-[11.5rem] md:w-[7.25rem]",
  },
  {
    id: "crew",
    ...homeImages.crew,
    className:
      "right-0 bottom-[4%] z-[2] h-[4.75rem] w-[7.75rem] sm:h-[5.75rem] sm:w-[9.5rem] md:h-[7.25rem] md:w-[11.75rem]",
  },
] as const;

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

      <RevealStagger className="relative mx-auto mt-14 h-[17.5rem] w-full max-w-[34rem] sm:mt-16 sm:h-[21rem] sm:max-w-[38rem] md:mt-20 md:h-[26rem] md:max-w-[42rem]">
        {galleryItems.map((item, index) => (
          <RevealItem
            key={item.id}
            className={cn("absolute overflow-hidden rounded-sm", item.className)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 220px"
              className="object-cover"
              priority={index === 2}
            />
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
