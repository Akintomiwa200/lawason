import { v2 as cloudinary } from "cloudinary";

import { isCloudinaryConfigured } from "@/lib/env";

function ensureConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export async function uploadToCloudinary(
  file: File,
  folder = "gmlawason",
): Promise<CloudinaryUploadResult> {
  const client = ensureConfigured();
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
  }>((resolve, reject) => {
    client.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(uploaded);
        },
      )
      .end(buffer);
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}
