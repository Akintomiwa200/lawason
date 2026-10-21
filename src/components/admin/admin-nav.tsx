"use client";

import {
  CalendarDays,
  Clapperboard,
  FileText,
  Film,
  Image as ImageIcon,
  LayoutDashboard,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/registrations", label: "Registrations", icon: Ticket },
  { href: "/admin/videos", label: "YouTube", icon: Film },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, item: AdminNavItem) {
  if (item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className="font-display text-lg font-semibold tracking-tight text-accent"
        onClick={onNavigate}
      >
        GMLawason
      </Link>
      <p className="mt-1 text-[0.7rem] uppercase tracking-[0.24em] text-muted">
        Admin
      </p>

      <nav className="mt-8 space-y-1">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-muted hover:bg-accent/5 hover:text-foreground",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground"
      >
        <span className="flex items-center gap-2">
          <Clapperboard className="size-4 text-accent" />
          Admin menu
        </span>
        <span className="text-muted">☰</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto border-r border-border bg-surface p-6">
            <AdminSidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
