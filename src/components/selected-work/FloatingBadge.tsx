import { cn } from "@/lib/utils";

interface FloatingBadgeProps {
  label: string;
  className?: string;
}

export function FloatingBadge({ label, className }: FloatingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.01em] text-[#1a1a1a] shadow-[0_4px_18px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:bg-surface/95 dark:text-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
