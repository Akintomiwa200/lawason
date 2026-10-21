"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteUser, updateUserRole } from "@/actions/users";

interface UserRowActionsProps {
  userId: string;
  role: "USER" | "ADMIN";
  isSelf: boolean;
}

export function UserRowActions({ userId, role, isSelf }: UserRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [currentRole, setCurrentRole] = useState(role);

  function handleRoleChange(nextRole: string) {
    if (nextRole === currentRole) {
      return;
    }
    startTransition(async () => {
      try {
        await updateUserRole(userId, nextRole);
        setCurrentRole(nextRole as "USER" | "ADMIN");
        toast.success("Role updated");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not update role");
      }
    });
  }

  function handleDelete() {
    if (!window.confirm("Delete this user? This cannot be undone.")) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success("User deleted");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not delete user");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={currentRole}
        disabled={pending || isSelf}
        onChange={(event) => handleRoleChange(event.target.value)}
        className="rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground outline-none transition focus:border-accent disabled:opacity-50"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending || isSelf}
        className="text-xs font-medium text-red-500 transition hover:underline disabled:cursor-not-allowed disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  );
}
