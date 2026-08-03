import type { NextConfig } from "next";

const googleAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID?.trim() &&
    process.env.GOOGLE_CLIENT_SECRET?.trim(),
);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: googleAuthConfigured ? "true" : "false",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
