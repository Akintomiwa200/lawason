import Link from "next/link";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/videos", label: "YouTube" },
  { href: "/admin/media", label: "Media" },
];

export function AdminShell({
  children,
  title,
  action,
}: {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl gap-8 px-6 py-10">
        <aside className="hidden w-52 shrink-0 md:block">
          <Link href="/" className="font-display text-lg font-semibold text-accent">
            GMLawason
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">Admin</p>
          <nav className="mt-8 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-accent/10 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {action}
          </div>
          <div className={cn("space-y-6")}>{children}</div>
        </div>
      </div>
    </div>
  );
}
