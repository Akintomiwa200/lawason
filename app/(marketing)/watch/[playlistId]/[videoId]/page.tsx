import { notFound } from "next/navigation";

import { WatchPlayer } from "@/components/watch/watch-player";
import { getWatchVideo } from "@/lib/watch-queries";

export default async function WatchVideoPage({
  params,
}: {
  params: Promise<{ playlistId: string; videoId: string }>;
}) {
  const { playlistId, videoId } = await params;
  const result = await getWatchVideo(videoId, playlistId);

  if (!result) {
    notFound();
  }

  return <WatchPlayer playlist={result.playlist} video={result.video} />;
}
