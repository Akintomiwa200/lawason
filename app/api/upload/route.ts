import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isCloudinaryConfigured, isDatabaseConfigured } from "@/lib/env";
import { requireAdmin } from "@/lib/require-session";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "");
  const folder = String(formData.get("folder") ?? "gmlawason");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A file is required" }, { status: 400 });
  }

  const uploaded = await uploadToCloudinary(file, folder);

  if (isDatabaseConfigured()) {
    await prisma.mediaAsset.create({
      data: {
        publicId: uploaded.publicId,
        url: uploaded.url,
        width: uploaded.width,
        height: uploaded.height,
        format: uploaded.format,
        bytes: uploaded.bytes,
        alt: alt || null,
        folder,
      },
    });
  }

  return NextResponse.json(uploaded);
}
