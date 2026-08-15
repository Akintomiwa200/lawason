import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/event-form";
import { prisma } from "@/lib/db";

function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    notFound();
  }

  return (
    <AdminShell title={event.title}>
      <EventForm
        event={{
          ...event,
          startDate: toLocalInput(event.startDate),
          endDate: event.endDate ? toLocalInput(event.endDate) : null,
        }}
      />
    </AdminShell>
  );
}
