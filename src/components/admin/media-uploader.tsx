"use client";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  className?: string;
}

export function MediaUploader({
  label = "Image",
  value,
  onChange,
  folder = "gmlawason",
  className,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        url?: string;
        publicId?: string;
        error?: string;
      };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Upload failed");
      }
      onChange(payload.url, payload.publicId);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-40 w-full rounded-2xl border border-border object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-surface-elevated text-sm text-muted">
          No image yet
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent">
        {uploading ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleFile(file);
            }
          }}
        />
      </label>
    </div>
  );
}
