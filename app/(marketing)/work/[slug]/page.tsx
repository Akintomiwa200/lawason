import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutContactCta } from "@/components/about/about-contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { PageShell } from "@/components/pages/page-sections";
import { WorkDetail } from "@/components/work/WorkDetail";
import { getWorkBySlug, getWorkSlugs } from "@/components/work/data";

interface WorkProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    return { title: "Work" };
  }

  return {
    title: work.title,
    description: work.description,
  };
}

export default async function WorkProjectPage({ params }: WorkProjectPageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  return (
    <PageShell hideSpotlight>
      <WorkDetail work={work} />

      <Reveal>
        <AboutContactCta />
      </Reveal>
    </PageShell>
  );
}
