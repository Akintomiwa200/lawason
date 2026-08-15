import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { getWatchSamplePlaylist, getWatchSampleVideo, getWatchSamples } from "@/lib/watch-samples";
import { youtubeThumb, type WatchPlaylist, type WatchVideo } from "@/types/watch";

function serializePlaylist(playlist: {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  itemCount: number;
  videos: {
    id: string;
    youtubeId: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    publishedAt: Date | null;
    playlistId: string | null;
  }[];
}): WatchPlaylist {
  return {
    id: playlist.id,
    youtubeId: playlist.youtubeId,
    title: playlist.title,
    description: playlist.description,
    thumbnail: playlist.thumbnail,
    itemCount: playlist.itemCount || playlist.videos.length,
    videos: playlist.videos.map((video) => ({
      id: video.id,
      youtubeId: video.youtubeId,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail || youtubeThumb(video.youtubeId),
      publishedAt: video.publishedAt?.toISOString() ?? null,
      playlistId: playlist.youtubeId,
    })),
  };
}

export async function getWatchCatalog(): Promise<WatchPlaylist[]> {
  if (!isDatabaseConfigured()) {
    return getWatchSamples();
  }

  try {
    const playlists = await prisma.youtubePlaylist.findMany({
      include: { videos: { orderBy: { publishedAt: "desc" } } },
      orderBy: { title: "asc" },
    });
    if (playlists.length === 0) {
      return getWatchSamples();
    }
    return playlists.map(serializePlaylist);
  } catch {
    return getWatchSamples();
  }
}

export async function getWatchPlaylist(playlistId: string) {
  if (!isDatabaseConfigured()) {
    return getWatchSamplePlaylist(playlistId);
  }

  try {
    const playlist = await prisma.youtubePlaylist.findUnique({
      where: { youtubeId: playlistId },
      include: { videos: { orderBy: { publishedAt: "desc" } } },
    });
    if (playlist) {
      return serializePlaylist(playlist);
    }
  } catch {
    // samples
  }

  return getWatchSamplePlaylist(playlistId);
}

export async function getWatchVideo(videoId: string, playlistId?: string) {
  if (isDatabaseConfigured()) {
    try {
      const video = await prisma.youtubeVideo.findUnique({
        where: { youtubeId: videoId },
        include: { playlist: { include: { videos: { orderBy: { publishedAt: "desc" } } } } },
      });
      if (video?.playlist) {
        const playlist = serializePlaylist(video.playlist);
        const current = playlist.videos.find((item) => item.youtubeId === videoId);
        if (current) {
          return { playlist, video: current };
        }
      }
    } catch {
      // samples
    }
  }

  return getWatchSampleVideo(videoId, playlistId);
}

export function nextVideos(playlist: WatchPlaylist, videoId: string): WatchVideo[] {
  const index = playlist.videos.findIndex((video) => video.youtubeId === videoId);
  if (index === -1) {
    return playlist.videos.slice(0, 6);
  }
  return [...playlist.videos.slice(index + 1), ...playlist.videos.slice(0, index)].slice(0, 6);
}
