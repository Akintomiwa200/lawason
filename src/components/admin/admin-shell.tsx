import Link from "next/link";

import { AdminMobileNav, AdminSidebarContent } from "@/components/admin/admin-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { auth } from "@/lib/auth";

export async function AdminShell({
  children,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-8 md:py-10">
        <aside className="sticky top-10 hidden h-[calc(100vh-5rem)] w-52 shrink-0 self-start overflow-y-auto md:block">
          <AdminSidebarContent />
        </aside>

        <div className="min-w-0 flex-1">
          <AdminMobileNav />

          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {description ? (
                <p className="mt-1.5 text-sm text-muted">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {action}
              <AdminUserMenu fallbackName={session?.user?.name} />
            </div>
          </div>

          <div className="space-y-6">{children}</div>

          <p className="mt-12 text-xs text-muted">
            <Link href="/" className="transition hover:text-accent">
              ← Back to GMLawason
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
