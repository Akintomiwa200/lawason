"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-session";
import { slugify } from "@/lib/slug";
import { parsePageBlocks, type PageBlock } from "@/types/cms";

const pageSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  showInNav: z.boolean().default(false),
  content: z.array(z.unknown()).default([]),
  publish: z.boolean().default(false),
});

export async function savePage(input: z.infer<typeof pageSchema>) {
  const session = await requireAdmin();
  const data = pageSchema.parse(input);
  const slug = slugify(data.slug || data.title);

  if (!slug) {
    throw new Error("A valid slug is required");
  }

  const content = parsePageBlocks(data.content) as PageBlock[];
  const status = data.publish ? ("PUBLISHED" as const) : ("DRAFT" as const);

  const payload = {
    title: data.title,
    slug,
    excerpt: data.excerpt || null,
    coverImage: data.coverImage || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    showInNav: data.showInNav,
    content,
    status,
    publishedAt: data.publish ? new Date() : null,
    authorId: session.user.id,
  };

  const page = data.id
    ? await prisma.page.update({
        where: { id: data.id },
        data: payload,
      })
    : await prisma.page.create({ data: payload });

  revalidatePath("/admin/pages");
  revalidatePath(`/pages/${page.slug}`);
  revalidatePath("/");

  return { id: page.id, slug: page.slug, status: page.status };
}

export async function deletePage(id: string) {
  await requireAdmin();
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  revalidatePath(`/pages/${page.slug}`);
  revalidatePath("/");
}
