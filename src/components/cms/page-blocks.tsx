import Image from "next/image";
import Link from "next/link";

import type { PageBlock } from "@/types/cms";

export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return (
            <h2
              key={block.id}
              className="font-display text-3xl font-semibold tracking-tight text-foreground"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={block.id} className="max-w-3xl text-base leading-relaxed text-muted md:text-lg">
              {block.text}
            </p>
          );
        }

        if (block.type === "image" && block.url) {
          return (
            <div key={block.id} className="overflow-hidden rounded-[2rem] border border-border">
              <Image
                src={block.url}
                alt={block.alt ?? ""}
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>
          );
        }

        if (block.type === "gallery") {
          return (
            <div key={block.id} className="grid gap-4 sm:grid-cols-2">
              {block.images.map((image) => (
                <div key={image.url} className="overflow-hidden rounded-3xl border border-border">
                  <Image
                    src={image.url}
                    alt={image.alt ?? ""}
                    width={1200}
                    height={800}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          );
        }

        if (block.type === "video" && block.youtubeId) {
          return (
            <div key={block.id} className="aspect-video overflow-hidden rounded-[2rem] border border-border">
              <iframe
                title="YouTube video"
                src={`https://www.youtube.com/embed/${block.youtubeId}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }

        if (block.type === "cta") {
          return (
            <Link
              key={block.id}
              href={block.href}
              className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
            >
              {block.label}
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
}
