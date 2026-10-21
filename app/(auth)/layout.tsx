import Link from "next/link";
import { Suspense } from "react";

import { company } from "@/lib/company";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-4 z-10 px-4 sm:px-6 lg:top-8">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            href="/"
            className="pointer-events-auto inline-block font-display text-lg font-semibold tracking-tight text-accent transition hover:opacity-80"
          >
            {company.shortName}
          </Link>
        </div>
      </div>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
