import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";

export default async function AdminHomePage() {
  const [pages, events, registrations, videos, users] = await Promise.all([
    prisma.page.count(),
    prisma.event.count(),
    prisma.eventRegistration.count(),
    prisma.youtubeVideo.count(),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "Pages", value: pages, href: "/admin/pages" },
    { label: "Events", value: events, href: "/admin/events" },
    { label: "Registrations", value: registrations, href: "/admin/registrations" },
    { label: "YouTube videos", value: videos, href: "/admin/videos" },
    { label: "Users", value: users, href: "/admin" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-3xl border border-border bg-surface p-6 transition hover:border-accent"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-3 font-display text-4xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
