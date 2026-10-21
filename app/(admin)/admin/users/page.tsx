import { Search } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge, TableShell } from "@/components/admin/ui";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, session] = await Promise.all([searchParams, auth()]);
  const query = q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { registrations: true } },
    },
  });

  return (
    <AdminShell
      title="Users"
      description="Manage accounts and admin access."
    >
      <form method="get" className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name or email…"
          className="w-full rounded-2xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-accent"
        />
      </form>

      <TableShell
        isEmpty={users.length === 0}
        empty={query ? "No users match your search." : "No users yet."}
        head={
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Verified</th>
            <th className="px-4 py-3 font-medium">Registered</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        }
      >
        {users.map((user) => {
          const isSelf = user.id === session?.user?.id;
          return (
            <tr key={user.id} className="border-t border-border">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">
                  {user.name ?? "—"}
                  {isSelf ? <span className="ml-2 text-xs text-muted">(you)</span> : null}
                </p>
                <p className="text-muted">{user.email ?? "—"}</p>
              </td>
              <td className="px-4 py-3">
                <Badge tone={user.role === "ADMIN" ? "accent" : "neutral"}>
                  {user.role}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {user.emailVerified ? (
                  <Badge tone="success">Verified</Badge>
                ) : (
                  <Badge tone="warning">Unverified</Badge>
                )}
              </td>
              <td className="px-4 py-3 text-muted">{formatDate(user.createdAt)}</td>
              <td className="px-4 py-3">
                <UserRowActions
                  userId={user.id}
                  role={user.role}
                  isSelf={isSelf}
                />
              </td>
            </tr>
          );
        })}
      </TableShell>
    </AdminShell>
  );
}
