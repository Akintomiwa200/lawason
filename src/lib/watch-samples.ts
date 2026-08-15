import { youtubeThumb, type WatchPlaylist, type WatchVideo } from "@/types/watch";

function video(
  playlistId: string,
  youtubeId: string,
  title: string,
  description: string,
  publishedAt: string,
): WatchVideo {
  return {
    id: `${playlistId}-${youtubeId}`,
    youtubeId,
    title,
    description,
    thumbnail: youtubeThumb(youtubeId),
    publishedAt,
    playlistId,
  };
}

export const watchSamples: WatchPlaylist[] = [
  {
    id: "series-gaffer-man",
    youtubeId: "gaffer-man-show",
    title: "The Gaffer Man Show",
    description:
      "Conversations with lighting crew, DoPs, and set leads. How looks are built on Nigerian productions.",
    thumbnail: youtubeThumb("M7lc1UVf-VE"),
    itemCount: 4,
    videos: [
      video(
        "gaffer-man-show",
        "M7lc1UVf-VE",
        "Gaffer Man Show — Building a night look",
        "Godwin walks a motivated night exterior: practicals, bounce, and how the key stays invisible.",
        "2026-03-12T18:00:00.000Z",
      ),
      video(
        "gaffer-man-show",
        "aqz-KE-bpKQ",
        "Guest hour — DoP on coverage",
        "A working DoP on lensing a short scene and talking to the gaffer before the first setup.",
        "2026-02-20T18:00:00.000Z",
      ),
      video(
        "gaffer-man-show",
        "LXb3EKWsInQ",
        "Special effect lighting on a fast day",
        "Rain, haze, and a moving camera — what the lighting team actually does in the hour before call.",
        "2026-01-18T18:00:00.000Z",
      ),
      video(
        "gaffer-man-show",
        "YE7VzlLtp-4",
        "From plot to last look",
        "How a lighting plot survives contact with a real Ikorodu compound.",
        "2025-12-04T18:00:00.000Z",
      ),
    ],
  },
  {
    id: "series-lighting-lab",
    youtubeId: "lighting-lab",
    title: "Lighting Lab",
    description: "Short craft videos: one source, one problem, one fix. Shot on the studio floor.",
    thumbnail: youtubeThumb("R6MlUcmOul8"),
    itemCount: 4,
    videos: [
      video(
        "lighting-lab",
        "R6MlUcmOul8",
        "One lamp, one face",
        "A single source beauty setup and how to keep the eye alive without a fill truck.",
        "2026-04-02T10:00:00.000Z",
      ),
      video(
        "lighting-lab",
        "WhWc3b3KhnY",
        "Windows as motivated key",
        "Cheating daylight through a small Ikorodu window without blowing the walls.",
        "2026-03-21T10:00:00.000Z",
      ),
      video(
        "lighting-lab",
        "Y-rmzh0PI3c",
        "Practicals that actually read",
        "When a bulb in frame is the key, and when it is only set dressing.",
        "2026-02-08T10:00:00.000Z",
      ),
      video(
        "lighting-lab",
        "mN0zPOpADL4",
        "Colour on a night street",
        "Sodium, LED shop signs, and how to pick a white balance that still feels like Lagos.",
        "2026-01-14T10:00:00.000Z",
      ),
    ],
  },
  {
    id: "series-on-set",
    youtubeId: "on-set",
    title: "On Set",
    description: "BTS from studio days — camera, grip, and lighting moving as one department.",
    thumbnail: youtubeThumb("uYZt4jXFbK8"),
    itemCount: 4,
    videos: [
      video(
        "on-set",
        "uYZt4jXFbK8",
        "Call time to first shot",
        "A compressed morning: pre-light, safety, and the first rehearsal.",
        "2026-05-01T09:00:00.000Z",
      ),
      video(
        "on-set",
        "jNQXAC9IVRw",
        "Moving the camera through a lit room",
        "How the gaffer and operator keep the look when the camera leaves the mark.",
        "2026-04-16T09:00:00.000Z",
      ),
      video(
        "on-set",
        "eIho2S0ZahI",
        "Rain night — effects lighting",
        "Backlight, rain, and keeping faces readable without killing the weather.",
        "2026-03-03T09:00:00.000Z",
      ),
      video(
        "on-set",
        "hFZFjoX2cGg",
        "Wrap notes",
        "What the team logs after a long day so the next setup is faster.",
        "2026-02-11T09:00:00.000Z",
      ),
    ],
  },
  {
    id: "series-academy",
    youtubeId: "academy-shorts",
    title: "Academy Shorts",
    description: "Free lessons from GM Lawason Academy — stands, flags, and how to see light.",
    thumbnail: youtubeThumb("C0DPdy98e4c"),
    itemCount: 4,
    videos: [
      video(
        "academy-shorts",
        "C0DPdy98e4c",
        "Stands and safety in five minutes",
        "Bags, boom, and why we never leave a C-stand unlocked.",
        "2026-05-20T11:00:00.000Z",
      ),
      video(
        "academy-shorts",
        "9xwazD5SyVg",
        "Reading a face before you light it",
        "Where the key wants to sit, and what the skin is already doing.",
        "2026-04-28T11:00:00.000Z",
      ),
      video(
        "academy-shorts",
        "s7L2PVdrb_8",
        "Flags, nets, and negative fill",
        "Taking light away is often the whole job.",
        "2026-03-30T11:00:00.000Z",
      ),
      video(
        "academy-shorts",
        "D0q0QeQspMY",
        "What to bring on day one",
        "Gloves, layers, and how to stand where you are useful.",
        "2026-02-25T11:00:00.000Z",
      ),
    ],
  },
];

export function getWatchSamples() {
  return watchSamples;
}

export function getWatchSamplePlaylist(playlistId: string) {
  return watchSamples.find((playlist) => playlist.youtubeId === playlistId) ?? null;
}

export function getWatchSampleVideo(videoId: string, playlistId?: string) {
  const playlists = playlistId
    ? watchSamples.filter((playlist) => playlist.youtubeId === playlistId)
    : watchSamples;
  for (const playlist of playlists) {
    const match = playlist.videos.find((video) => video.youtubeId === videoId);
    if (match) {
      return { playlist, video: match };
    }
  }
  return null;
}
