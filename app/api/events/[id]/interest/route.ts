import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { publishEventLive } from "@/lib/event-bus";
import { getEventLiveSnapshot } from "@/lib/event-queries";
import { requireUser } from "@/lib/require-session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const existing = await prisma.eventInterest.findUnique({
      where: {
        eventId_userId: { eventId: id, userId: session.user.id },
      },
    });

    if (existing) {
      await prisma.eventInterest.delete({ where: { id: existing.id } });
    } else {
      await prisma.eventInterest.create({
        data: { eventId: id, userId: session.user.id },
      });
    }

    const snapshot = await getEventLiveSnapshot(id);
    if (snapshot) {
      publishEventLive(snapshot);
    }

    return NextResponse.json({
      interested: !existing,
      ...snapshot,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message.includes("sign in") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
