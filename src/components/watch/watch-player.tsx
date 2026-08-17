import Image from "next/image";
import Link from "next/link";

import { WatchVideoCard } from "@/components/watch/watch-video-card";
import { nextVideos } from "@/lib/watch-queries";
import { youtubeEmbed, type WatchPlaylist, type WatchVideo } from "@/types/watch";

function formatDate(value?: string | null) {
  if (!value) {
    return null;
  }
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function WatchPlayer({
  playlist,
  video,
}: {
  playlist: WatchPlaylist;
  video: WatchVideo;
}) {
  const upNext = nextVideos(playlist, video.youtubeId);
  const date = formatDate(video.publishedAt);

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="mx-auto w-full max-w-[90rem] px-4 lg:px-6">
        <Link href={`/watch/${playlist.youtubeId}`} className="text-sm text-muted hover:text-foreground">
          ← {playlist.title}
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_22rem]">
          <article>
            <div className="overflow-hidden rounded-[1.6rem] border border-border bg-black">
              <div className="aspect-video">
                <iframe
                  src={youtubeEmbed(video.youtubeId, true)}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {playlist.title}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-foreground md:text-4xl">
              {video.title}
            </h1>
            {date ? <p className="mt-2 text-sm text-muted">{date}</p> : null}
            {video.description ? (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{video.description}</p>
            ) : null}
          </article>

          <aside>
            <h2 className="font-display text-xl font-semibold">Up next</h2>
            <div className="mt-4 space-y-4">
              {upNext.map((item) => (
                <Link
                  key={item.id}
                  href={`/watch/${playlist.youtubeId}/${item.youtubeId}`}
                  className="flex gap-3 rounded-2xl border border-border bg-surface p-2 transition hover:border-accent"
                >
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-surface-elevated">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="pt-1 text-sm font-medium leading-snug text-foreground">{item.title}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">More from this series</h2>
            <Link href={`/watch/${playlist.youtubeId}`} className="text-sm font-medium text-accent">
              View series
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlist.videos
              .filter((item) => item.youtubeId !== video.youtubeId)
              .slice(0, 6)
              .map((item) => (
                <WatchVideoCard key={item.id} video={item} playlistId={playlist.youtubeId} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
