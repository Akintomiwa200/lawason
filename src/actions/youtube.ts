"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/require-session";
import { syncYoutubeChannel } from "@/lib/youtube";

export async function syncYoutube() {
  await requireAdmin();
  const result = await syncYoutubeChannel();
  revalidatePath("/watch");
  revalidatePath("/admin/videos");
  return result;
}
