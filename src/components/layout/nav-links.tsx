"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  className?: string;
  onNavigate?: () => void;
  extraItems?: NavItem[];
}

export function NavLinks({ className, onNavigate, extraItems = [] }: NavLinksProps) {
  const pathname = usePathname();
  const items = [...mainNav, ...extraItems];

  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="Main">
      {items.map((item) => {
        const isHome = item.href === "/";
        const isActive = isHome
          ? pathname === "/"
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-accent"
                : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
