import {
  CalendarDays,
  FileText,
  Film,
  Images,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge, Panel, StatCard } from "@/components/admin/ui";
import { prisma } from "@/lib/db";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminHomePage() {
  const [
    pages,
    publishedPages,
    events,
    openEvents,
    registrations,
    pendingRegistrations,
    videos,
    users,
    admins,
    media,
    recentEvents,
    recentRegistrations,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.page.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: "OPEN" } }),
    prisma.eventRegistration.count(),
    prisma.eventRegistration.count({ where: { status: "PENDING" } }),
    prisma.youtubeVideo.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.mediaAsset.count(),
    prisma.event.findMany({
      orderBy: { startDate: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, startDate: true },
    }),
    prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { event: { select: { title: true } } },
    }),
  ]);

  const stats = [
    {
      label: "Registrations",
      value: registrations,
      href: "/admin/registrations",
      icon: Ticket,
      hint: `${pendingRegistrations} pending`,
    },
    {
      label: "Events",
      value: events,
      href: "/admin/events",
      icon: CalendarDays,
      hint: `${openEvents} open`,
    },
    {
      label: "Users",
      value: users,
      href: "/admin/users",
      icon: Users,
      hint: `${admins} admin${admins === 1 ? "" : "s"}`,
    },
    {
      label: "Pages",
      value: pages,
      href: "/admin/pages",
      icon: FileText,
      hint: `${publishedPages} published`,
    },
    {
      label: "YouTube videos",
      value: videos,
      href: "/admin/videos",
      icon: Film,
    },
    {
      label: "Media assets",
      value: media,
      href: "/admin/media",
      icon: Images,
    },
  ];

  const quickActions = [
    { href: "/admin/events/new", label: "New event" },
    { href: "/admin/pages/new", label: "New page" },
    { href: "/admin/media", label: "Upload media" },
    { href: "/admin/settings", label: "Site settings" },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Studio overview — content, events, enrollments and media at a glance."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Panel title="Quick actions">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((actionItem) => (
            <Link
              key={actionItem.href}
              href={actionItem.href}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
            >
              {actionItem.label}
            </Link>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent registrations"
          action={
            <Link
              href="/admin/registrations"
              className="text-xs font-medium text-accent hover:underline"
            >
              View all
            </Link>
          }
        >
          {recentRegistrations.length === 0 ? (
            <p className="text-sm text-muted">No registrations yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentRegistrations.map((registration) => (
                <li
                  key={registration.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {registration.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {registration.event.title}
                    </p>
                  </div>
                  <Badge
                    tone={
                      registration.status === "CONFIRMED"
                        ? "success"
                        : registration.status === "CANCELLED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {registration.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent events"
          action={
            <Link
              href="/admin/events"
              className="text-xs font-medium text-accent hover:underline"
            >
              View all
            </Link>
          }
        >
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted">No events yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="truncate text-sm font-medium text-foreground hover:text-accent"
                    >
                      {event.title}
                    </Link>
                    <p className="truncate text-xs text-muted">
                      {formatDate(event.startDate)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      event.status === "OPEN"
                        ? "success"
                        : event.status === "DRAFT"
                          ? "neutral"
                          : "accent"
                    }
                  >
                    {event.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}
