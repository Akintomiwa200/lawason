import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export async function getPublishedNavPages() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.page.findMany({
      where: { status: "PUBLISHED", showInNav: true },
      select: { slug: true, title: true },
      orderBy: { title: "asc" },
    });
  } catch {
    return [];
  }
}
