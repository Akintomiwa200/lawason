import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { subscribeEventLive } from "@/lib/event-bus";
import { serializeEventCard } from "@/lib/event-queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let unsubscribe: () => void = () => undefined;
  let poll: ReturnType<typeof setInterval> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      unsubscribe = subscribeEventLive((payload) => send(payload));

      poll = setInterval(() => {
        void (async () => {
          if (!isDatabaseConfigured()) {
            return;
          }
          const events = await prisma.event.findMany({
            where: { status: { in: ["OPEN", "CLOSED", "COMPLETED"] } },
            include: {
              registrations: {
                where: { status: { not: "CANCELLED" } },
                select: {
                  name: true,
                  status: true,
                  userId: true,
                  user: { select: { name: true, image: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 8,
              },
              interests: { select: { userId: true } },
            },
          });

          send({
            type: "snapshot",
            events: events.map((event) => {
              const card = serializeEventCard(event);
              return {
                eventId: card.id,
                goingCount: card.goingCount,
                interestedCount: card.interestedCount,
                attendees: card.attendees,
              };
            }),
          });
        })();
      }, 8000);

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 15000);
    },
    cancel() {
      unsubscribe();
      if (poll) {
        clearInterval(poll);
      }
      if (heartbeat) {
        clearInterval(heartbeat);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
