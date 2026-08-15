import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { PageEditor } from "@/components/admin/page-editor";
import { prisma } from "@/lib/db";
import { parsePageBlocks } from "@/types/cms";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });

  if (!page) {
    notFound();
  }

  return (
    <AdminShell title={page.title}>
      <PageEditor
        page={{
          ...page,
          content: parsePageBlocks(page.content),
        }}
      />
    </AdminShell>
  );
}
