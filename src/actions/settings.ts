"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-session";

export async function saveSetting(key: string, value: string) {
  await requireAdmin();

  const trimmedKey = key.trim();
  if (!trimmedKey) {
    throw new Error("Setting key is required");
  }

  await prisma.siteSetting.upsert({
    where: { key: trimmedKey },
    create: { key: trimmedKey, value },
    update: { value },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function saveSettings(entries: Array<{ key: string; value: string }>) {
  await requireAdmin();

  await prisma.$transaction(
    entries.map((entry) =>
      prisma.siteSetting.upsert({
        where: { key: entry.key },
        create: { key: entry.key, value: entry.value },
        update: { value: entry.value },
      }),
    ),
  );

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function deleteSetting(key: string) {
  await requireAdmin();
  await prisma.siteSetting.deleteMany({ where: { key } });
  revalidatePath("/admin/settings");
}
