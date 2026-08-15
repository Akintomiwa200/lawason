import { prisma } from "@/lib/db";
import { isYoutubeConfigured } from "@/lib/env";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

interface YoutubeThumbnails {
  high?: { url: string };
  medium?: { url: string };
  default?: { url: string };
}

function pickThumbnail(thumbnails?: YoutubeThumbnails) {
  return thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url ?? null;
}

async function youtubeGet<T>(path: string, params: Record<string, string>) {
  const url = new URL(`${YOUTUBE_API}/${path}`);
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY!);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API ${path} failed: ${response.status} ${body}`);
  }

  return (await response.json()) as T;
}

async function fetchAllPlaylistItems(playlistId: string) {
  const videos: {
    youtubeId: string;
    title: string;
    description: string;
    thumbnail: string | null;
    publishedAt: Date | null;
  }[] = [];

  let pageToken = "";

  do {
    const data = await youtubeGet<{
      nextPageToken?: string;
      items?: {
        snippet?: {
          title?: string;
          description?: string;
          publishedAt?: string;
          thumbnails?: YoutubeThumbnails;
          resourceId?: { videoId?: string };
        };
      }[];
    }>("playlistItems", {
      part: "snippet",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });

    for (const item of data.items ?? []) {
      const youtubeId = item.snippet?.resourceId?.videoId;
      if (!youtubeId) {
        continue;
      }

      videos.push({
        youtubeId,
        title: item.snippet?.title ?? "Untitled",
        description: item.snippet?.description ?? "",
        thumbnail: pickThumbnail(item.snippet?.thumbnails),
        publishedAt: item.snippet?.publishedAt
          ? new Date(item.snippet.publishedAt)
          : null,
      });
    }

    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  return videos;
}

export async function syncYoutubeChannel() {
  if (!isYoutubeConfigured()) {
    throw new Error("YouTube is not configured");
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID!;

  const playlists: {
    youtubeId: string;
    title: string;
    description: string;
    thumbnail: string | null;
    itemCount: number;
  }[] = [];

  let pageToken = "";

  do {
    const data = await youtubeGet<{
      nextPageToken?: string;
      items?: {
        id?: string;
        snippet?: {
          title?: string;
          description?: string;
          thumbnails?: YoutubeThumbnails;
        };
        contentDetails?: { itemCount?: number };
      }[];
    }>("playlists", {
      part: "snippet,contentDetails",
      channelId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });

    for (const item of data.items ?? []) {
      if (!item.id) {
        continue;
      }

      playlists.push({
        youtubeId: item.id,
        title: item.snippet?.title ?? "Untitled series",
        description: item.snippet?.description ?? "",
        thumbnail: pickThumbnail(item.snippet?.thumbnails),
        itemCount: item.contentDetails?.itemCount ?? 0,
      });
    }

    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  const channel = await youtubeGet<{
    items?: {
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }[];
  }>("channels", {
    part: "contentDetails",
    id: channelId,
  });

  const uploadsId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (uploadsId && !playlists.some((playlist) => playlist.youtubeId === uploadsId)) {
    playlists.unshift({
      youtubeId: uploadsId,
      title: "Latest uploads",
      description: "Every new video from the channel",
      thumbnail: null,
      itemCount: 0,
    });
  }

  let videoCount = 0;

  for (const playlist of playlists) {
    const saved = await prisma.youtubePlaylist.upsert({
      where: { youtubeId: playlist.youtubeId },
      create: playlist,
      update: {
        title: playlist.title,
        description: playlist.description,
        thumbnail: playlist.thumbnail,
        itemCount: playlist.itemCount,
        syncedAt: new Date(),
      },
    });

    const items = await fetchAllPlaylistItems(playlist.youtubeId);
    videoCount += items.length;

    for (const video of items) {
      await prisma.youtubeVideo.upsert({
        where: { youtubeId: video.youtubeId },
        create: {
          ...video,
          playlistId: saved.id,
        },
        update: {
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          publishedAt: video.publishedAt,
          playlistId: saved.id,
          syncedAt: new Date(),
        },
      });
    }
  }

  await prisma.siteSetting.upsert({
    where: { key: "youtubeLastSyncedAt" },
    create: {
      key: "youtubeLastSyncedAt",
      value: new Date().toISOString(),
    },
    update: { value: new Date().toISOString() },
  });

  return {
    playlists: playlists.length,
    videos: videoCount,
  };
}
