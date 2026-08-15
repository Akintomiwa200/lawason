import Image from "next/image";

import { YoutubeSyncButton } from "@/components/admin/youtube-sync-button";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { isYoutubeConfigured } from "@/lib/env";

export default async function AdminVideosPage() {
  const playlists = await prisma.youtubePlaylist.findMany({
    include: { videos: { orderBy: { publishedAt: "desc" }, take: 6 } },
    orderBy: { title: "asc" },
  });

  const lastSync = await prisma.siteSetting.findUnique({
    where: { key: "youtubeLastSyncedAt" },
  });

  return (
    <AdminShell title="YouTube" action={<YoutubeSyncButton />}>
      {!isYoutubeConfigured() ? (
        <p className="rounded-3xl border border-border bg-surface p-5 text-sm text-muted">
          Add YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID to sync the studio channel.
        </p>
      ) : null}
      {lastSync ? (
        <p className="text-sm text-muted">Last synced {new Date(lastSync.value).toLocaleString()}</p>
      ) : null}
      <div className="space-y-8">
        {playlists.map((playlist) => (
          <section key={playlist.id} className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">{playlist.title}</h2>
              <p className="text-sm text-muted">{playlist.itemCount} videos in this series</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {playlist.videos.map((video) => (
                <article key={video.id} className="overflow-hidden rounded-3xl border border-border bg-surface">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      width={640}
                      height={360}
                      className="h-40 w-full object-cover"
                    />
                  ) : null}
                  <div className="p-4">
                    <p className="font-medium">{video.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {playlists.length === 0 ? (
          <p className="text-sm text-muted">No videos yet. Sync the YouTube channel to pull series and uploads.</p>
        ) : null}
      </div>
    </AdminShell>
  );
}
