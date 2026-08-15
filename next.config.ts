import type { NextConfig } from "next";

import {
  isAppleAuthConfigured,
  isGoogleAuthConfigured,
} from "./src/lib/env";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs", "cloudinary"],
  env: {
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: isGoogleAuthConfigured() ? "true" : "false",
    NEXT_PUBLIC_APPLE_AUTH_ENABLED: isAppleAuthConfigured() ? "true" : "false",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
