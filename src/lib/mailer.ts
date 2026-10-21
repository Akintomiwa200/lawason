import nodemailer, { type Transporter } from "nodemailer";

import type { EmailContent } from "@/lib/email";
import { getAppUrl } from "@/lib/utils";

const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASSWORD = process.env.SMTP_PASSWORD?.trim();
const MAIL_FROM =
  process.env.MAIL_FROM?.trim() ?? `GM Lawason Studios <${SMTP_USER ?? "no-reply@gmlawason.com"}>`;

export function isEmailDeliveryConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASSWORD);
}

let transporter: Transporter | null = null;

function getTransporter() {
  if (!isEmailDeliveryConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }

  return transporter;
}

interface SendEmailInput extends EmailContent {
  to: string;
}

interface SendEmailResult {
  delivered: boolean;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailInput): Promise<SendEmailResult> {
  if (!isEmailDeliveryConfigured()) {
    console.info(
      `[mailer] No SMTP configured. Would send "${subject}" to ${to} — ${text}`,
    );
    return { delivered: false };
  }

  try {
    const mailer = getTransporter();
    await mailer?.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    return { delivered: true };
  } catch (error) {
    console.error("[mailer] Failed to send email", error);
    return { delivered: false };
  }
}

export function buildActionUrl(path: string, token: string, extra?: string) {
  const base = getAppUrl();
  const params = new URLSearchParams({ token });

  if (extra) {
    params.set("email", extra);
  }

  return `${base}${path}?${params.toString()}`;
}
