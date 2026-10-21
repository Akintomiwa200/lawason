import { getAppUrl } from "@/lib/utils";

export function isEmailDeliveryConfigured() {
  return Boolean(process.env.SMTP_URL?.trim() || process.env.RESEND_API_KEY?.trim());
}

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  url?: string;
}

interface SendEmailResult {
  delivered: boolean;
}

/**
 * Sends a transactional email. When no mail provider is configured, the
 * message is logged and marked as not delivered so callers can surface the
 * action link in development instead of silently dropping it.
 */
export async function sendEmail({
  to,
  subject,
  text,
  url,
}: SendEmailInput): Promise<SendEmailResult> {
  const preview = url ? ` — link: ${url}` : text ? ` — ${text}` : "";

  if (!isEmailDeliveryConfigured()) {
    console.info(
      `[mailer] No email provider configured. Would send "${subject}" to ${to}${preview}`,
    );
    return { delivered: false };
  }

  // Provider integration point. Wire SMTP or a transactional API here.
  console.info(`[mailer] Sending "${subject}" to ${to}${preview}`);
  return { delivered: true };
}

export function buildActionUrl(path: string, token: string, extra?: string) {
  const base = getAppUrl();
  const params = new URLSearchParams({ token });

  if (extra) {
    params.set("email", extra);
  }

  return `${base}${path}?${params.toString()}`;
}
