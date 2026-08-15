import { NextResponse } from "next/server";

import { isYoutubeConfigured } from "@/lib/env";
import { syncYoutubeChannel } from "@/lib/youtube";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isYoutubeConfigured()) {
    return NextResponse.json(
      { error: "YouTube is not configured" },
      { status: 503 },
    );
  }

  const result = await syncYoutubeChannel();
  return NextResponse.json({ ok: true, ...result });
}
