"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-session";

const roleSchema = z.enum(["USER", "ADMIN"]);

export async function updateUserRole(userId: string, role: string) {
  const session = await requireAdmin();
  const parsedRole = roleSchema.parse(role);

  if (userId === session.user.id && parsedRole !== "ADMIN") {
    throw new Error("You cannot remove your own admin access");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsedRole },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (userId === session.user.id) {
    throw new Error("You cannot delete your own account");
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
