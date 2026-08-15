"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

interface NavbarCtaProps {
  className?: string;
}

const pillClassName =
  "inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110";

export function NavbarCta({ className }: NavbarCtaProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted",
          className,
        )}
      >
        …
      </button>
    );
  }

  if (session?.user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {session.user.role === "ADMIN" ? (
          <Link
            href="/admin"
            className="rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            Admin
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => signOut({ redirectTo: "/" })}
          className={pillClassName}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className={cn(pillClassName, className)}>
      Sign in
    </Link>
  );
}
