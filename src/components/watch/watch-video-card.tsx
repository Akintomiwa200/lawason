import Image from "next/image";
import Link from "next/link";

import type { WatchVideo } from "@/types/watch";

function formatDate(value?: string | null) {
  if (!value) {
    return null;
  }
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function WatchVideoCard({
  video,
  playlistId,
  priority = false,
}: {
  video: WatchVideo;
  playlistId: string;
  priority?: boolean;
}) {
  const date = formatDate(video.publishedAt);

  return (
    <Link
      href={`/watch/${playlistId}/${video.youtubeId}`}
      className="group overflow-hidden rounded-[1.4rem] border border-border bg-surface transition hover:border-accent"
    >
      <div className="relative aspect-video overflow-hidden bg-surface-elevated">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            priority={priority}
            loading={priority ? "eager" : undefined}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-glow">
            <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-current" />
          </span>
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-foreground">
          {video.title}
        </h3>
        {date ? <p className="mt-2 text-xs text-muted">{date}</p> : null}
      </div>
    </Link>
  );
}
