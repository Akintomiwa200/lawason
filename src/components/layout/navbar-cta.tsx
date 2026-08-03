"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface NavbarCtaProps {
  className?: string;
}

const pillClassName =
  "inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-glow transition hover:brightness-110";

export function NavbarCta({ className }: NavbarCtaProps) {
  const googleAuthEnabled =
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  const { data: session, status } = useSession();

  if (!googleAuthEnabled) {
    return (
      <Link href="/book" className={cn(pillClassName, className)}>
        Book a session
      </Link>
    );
  }

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
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "User avatar"}
            className="h-8 w-8 rounded-full border border-border object-cover"
          />
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
    <button
      type="button"
      onClick={() => {
        signIn("google", { redirectTo: "/" }).catch(() => {
          toast.error("Sign in failed. Check Google OAuth configuration.");
        });
      }}
      className={cn(pillClassName, className)}
    >
      Sign in
    </button>
  );
}
