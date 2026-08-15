"use client";

import { useState } from "react";
import { toast } from "sonner";

import { syncYoutube } from "@/actions/youtube";

export function YoutubeSyncButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          const result = await syncYoutube();
          toast.success(`Synced ${result.playlists} series and ${result.videos} videos`);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "YouTube sync failed");
        } finally {
          setPending(false);
        }
      }}
      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
    >
      {pending ? "Syncing…" : "Sync channel"}
    </button>
  );
}
