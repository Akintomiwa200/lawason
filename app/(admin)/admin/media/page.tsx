import Image from "next/image";

import { AdminShell } from "@/components/admin/admin-shell";
import { MediaLibraryUpload } from "@/components/admin/media-library-upload";
import { prisma } from "@/lib/db";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <AdminShell title="Media">
      <MediaLibraryUpload />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((asset) => (
          <figure key={asset.id} className="overflow-hidden rounded-3xl border border-border">
            <Image src={asset.url} alt={asset.alt ?? ""} width={600} height={400} className="h-40 w-full object-cover" />
            <figcaption className="truncate px-3 py-2 text-xs text-muted">{asset.publicId}</figcaption>
          </figure>
        ))}
      </div>
    </AdminShell>
  );
}
