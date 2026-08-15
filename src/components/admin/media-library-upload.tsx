"use client";

import { useRouter } from "next/navigation";

import { MediaUploader } from "@/components/admin/media-uploader";

export function MediaLibraryUpload() {
  const router = useRouter();

  return (
    <MediaUploader
      label="Upload to library"
      folder="gmlawason"
      onChange={() => router.refresh()}
    />
  );
}
