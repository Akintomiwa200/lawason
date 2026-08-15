import Link from "next/link";
import { notFound } from "next/navigation";

import { WatchVideoCard } from "@/components/watch/watch-video-card";
import { getWatchPlaylist } from "@/lib/watch-queries";

export default async function WatchSeriesPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const playlist = await getWatchPlaylist(playlistId);

  if (!playlist) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="mx-auto w-full max-w-[90rem] px-4 lg:px-6">
        <Link href="/watch" className="text-sm text-muted hover:text-foreground">
          ← All series
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Series</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{playlist.title}</h1>
        {playlist.description ? (
          <p className="mt-4 max-w-2xl text-base text-muted">{playlist.description}</p>
        ) : null}
        <p className="mt-2 text-sm text-muted">{playlist.videos.length} videos</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlist.videos.map((video) => (
            <WatchVideoCard key={video.id} video={video} playlistId={playlist.youtubeId} />
          ))}
        </div>
      </div>
    </div>
  );
}
