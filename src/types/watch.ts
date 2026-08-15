export interface WatchVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  publishedAt: string | null;
  playlistId: string;
}

export interface WatchPlaylist {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  itemCount: number;
  videos: WatchVideo[];
}

export function youtubeThumb(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function youtubeEmbed(youtubeId: string, autoplay = false) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) {
    params.set("autoplay", "1");
  }
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}
