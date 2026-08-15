import Image from "next/image";
import Link from "next/link";

import { WatchHero } from "@/components/watch/watch-hero";
import { WatchVideoCard } from "@/components/watch/watch-video-card";
import { getWatchCatalog } from "@/lib/watch-queries";

export const metadata = {
  title: "Watch",
  description:
    "The Gaffer Man Show, lighting labs, and academy shorts from GM Lawason Studios — play them in the studio player.",
};

export default async function WatchPage() {
  const playlists = await getWatchCatalog();
  const featured = playlists[0]?.videos[0] ?? null;
  const featuredSeries = playlists[0] ?? null;

  return (
    <div className="min-h-screen bg-[#F6F3EF] pb-20 dark:bg-background">
      <div className="mx-auto max-w-[1450px] px-6 pb-16 pt-28 sm:px-8 md:pt-36 lg:px-10 lg:pt-40">
        <WatchHero />

        {featured && featuredSeries ? (
          <Link
            href={`/watch/${featuredSeries.youtubeId}/${featured.youtubeId}`}
            className="group mt-[110px] grid overflow-hidden rounded-[1.8rem] border border-border bg-surface lg:grid-cols-[1.4fr_1fr]"
          >
            <div className="relative aspect-video bg-surface-elevated lg:aspect-auto lg:min-h-[22rem]">
              {featured.thumbnail ? (
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : null}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-glow">
                  <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[16px] border-y-transparent border-l-current" />
                </span>
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Featured · {featuredSeries.title}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold">{featured.title}</h2>
              {featured.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">{featured.description}</p>
              ) : null}
              <p className="mt-6 text-sm font-semibold text-accent">Play in the studio player</p>
            </div>
          </Link>
        ) : null}

        <div className="mt-16 space-y-14">
          {playlists.map((playlist) => (
            <section key={playlist.id}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold md:text-3xl">{playlist.title}</h2>
                  {playlist.description ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted">{playlist.description}</p>
                  ) : null}
                </div>
                <Link
                  href={`/watch/${playlist.youtubeId}`}
                  className="shrink-0 text-sm font-medium text-accent"
                >
                  View series
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {playlist.videos.slice(0, 4).map((video) => (
                  <WatchVideoCard key={video.id} video={video} playlistId={playlist.youtubeId} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
