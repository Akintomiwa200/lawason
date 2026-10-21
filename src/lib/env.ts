export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function isGoogleAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

export function isAppleAuthConfigured() {
  return Boolean(
    process.env.APPLE_ID?.trim() && process.env.APPLE_SECRET?.trim(),
  );
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

export function isYoutubeConfigured() {
  return Boolean(
    process.env.YOUTUBE_API_KEY?.trim() &&
      process.env.YOUTUBE_CHANNEL_ID?.trim(),
  );
}

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

/**
 * Built-in super-admin credentials.
 * Defaults to "admin" / "admin" so the dashboard is always reachable, and can
 * be overridden in the environment for real deployments.
 */
export function getSuperAdminUsername() {
  return process.env.SUPER_ADMIN_USERNAME?.trim() || "admin";
}

export function getSuperAdminPassword() {
  return process.env.SUPER_ADMIN_PASSWORD?.trim() || "admin";
}

export function getSuperAdminEmail() {
  return process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || "admin@gmlawason.local";
}
