import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageBlocks } from "@/components/cms/page-blocks";
import { PageHero, PageShell } from "@/components/pages/page-sections";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { parsePageBlocks } from "@/types/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isDatabaseConfigured()) {
    return {};
  }
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || page.status !== "PUBLISHED") {
    return {};
  }
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt || undefined,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isDatabaseConfigured()) {
    notFound();
  }
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || page.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <PageShell>
      <PageHero eyebrow="Studio page" title={page.title} description={page.excerpt ?? undefined} />
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        {page.coverImage ? (
          <div className="mb-12 overflow-hidden rounded-[2rem] border border-border">
            <Image
              src={page.coverImage}
              alt={page.title}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}
        <PageBlocks blocks={parsePageBlocks(page.content)} />
        <p className="mt-12 text-sm text-muted">
          <Link href="/" className="text-accent">
            Back home
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
