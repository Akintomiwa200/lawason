import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <AdminShell
      title="Events"
      action={
        <Link
          href="/admin/events/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          New event
        </Link>
      }
    >
      <div className="space-y-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/admin/events/${event.id}`}
            className="block rounded-3xl border border-border bg-surface p-5 hover:border-accent"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {event.type} · {event.status} · {event._count.registrations} registered
                </p>
              </div>
              <p className="text-sm text-muted">{event.startDate.toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
        {events.length === 0 ? (
          <p className="text-sm text-muted">No camps or events yet.</p>
        ) : null}
      </div>
    </AdminShell>
  );
}
