import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  href,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number | string;
  href?: string;
  icon?: LucideIcon;
  hint?: string;
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon ? (
          <span className="flex size-9 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon className="size-[18px]" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </>
  );

  const className =
    "rounded-3xl border border-border bg-surface p-6 transition hover:border-accent";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-surface p-6",
        className,
      )}
    >
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function TableShell({
  head,
  children,
  empty,
  isEmpty,
}: {
  head: React.ReactNode;
  children: React.ReactNode;
  empty?: string;
  isEmpty?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-elevated text-muted">{head}</thead>
        <tbody>{children}</tbody>
      </table>
      {isEmpty && empty ? (
        <p className="px-4 py-8 text-sm text-muted">{empty}</p>
      ) : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}) {
  const tones = {
    neutral: "bg-surface-elevated text-muted border-border",
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    danger: "bg-red-500/10 text-red-600 border-red-500/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
