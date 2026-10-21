"use client";

import { ChevronDown, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface AdminUserMenuProps {
  fallbackName?: string | null;
}

export function AdminUserMenu({ fallbackName }: AdminUserMenuProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const name = session?.user?.name ?? fallbackName ?? "Admin";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3 text-sm transition hover:border-accent"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
          {initials || "A"}
        </span>
        <span className="hidden font-medium text-foreground sm:inline">
          {name.split(" ")[0]}
        </span>
        <ChevronDown className="size-4 text-muted" />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            {email ? (
              <p className="truncate text-xs text-muted">{email}</p>
            ) : null}
          </div>
          <div className="p-1.5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-accent/5 hover:text-foreground"
            >
              <Home className="size-4" />
              View site
            </Link>
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-muted transition hover:bg-accent/5 hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
