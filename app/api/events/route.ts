import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getEventCards } from "@/lib/event-queries";
import { asEventTab } from "@/types/events";

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const tab = asEventTab(searchParams.get("tab"));
  const events = await getEventCards(tab, session?.user?.id);

  return NextResponse.json({ events });
}
