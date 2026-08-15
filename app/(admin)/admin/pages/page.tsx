import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AdminShell
      title="Pages"
      action={
        <Link
          href="/admin/pages/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          New page
        </Link>
      }
    >
      <div className="overflow-hidden rounded-3xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Nav</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/admin/pages/${page.id}`} className="font-medium hover:text-accent">
                    {page.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{page.status}</td>
                <td className="px-4 py-3">{page.showInNav ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-muted">
                  {page.updatedAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">No pages yet. Create one to publish live content.</p>
        ) : null}
      </div>
    </AdminShell>
  );
}
