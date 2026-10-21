import { company } from "@/lib/company";
import {
  escapeHtml,
  renderButton,
  renderCheckList,
  renderCodeBox,
  renderEmailLayout,
  renderFallbackLink,
  renderFeatureCards,
  renderInfoRow,
  renderPanel,
  renderDivider,
} from "@/lib/email/templates";

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

/** 6-digit password reset code. */
export function passwordResetCodeEmail(code: string): EmailContent {
  const subject = `Your ${company.shortName} verification code`;

  const text = [
    `${company.shortName} password reset`,
    "",
    "Use this 6-digit code to verify your identity and set a new password:",
    "",
    `    ${code}`,
    "",
    "This code expires in 15 minutes.",
    "If you didn't request a password reset, you can safely ignore this email — your password will stay the same.",
  ].join("\n");

  const html = renderEmailLayout({
    preview: `Your verification code is ${code} — expires in 15 minutes`,
    eyebrow: "Password reset",
    heading: "Verify your identity",
    subheading:
      "Enter the 6-digit code below to continue setting a new password.",
    content:
      renderCodeBox(code) +
      renderPanel(
        `<p style="margin:0;font-size:12.5px;line-height:1.6;color:${"#525252"};font-family:'Segoe UI',Arial,sans-serif;">For your security, this code can only be used once and expires in <strong style="color:#0a0a0a;">15 minutes</strong>.</p>`,
        "info",
      ),
    note: "Didn't request this? You can ignore this email — your password stays the same and no one can access your account without this code.",
  });

  return { subject, text, html };
}

/** Email address verification with a link. */
export function verifyEmailEmail(
  url: string,
  name?: string | null,
): EmailContent {
  const subject = `Verify your ${company.shortName} email`;
  const greeting = name ? `Hi ${name},` : "Welcome!";

  const text = [
    greeting,
    "",
    `Confirm your email to finish setting up your ${company.name} account.`,
    "",
    url,
    "",
    "This link expires in 24 hours.",
    "If you didn't create an account, you can safely ignore this email.",
  ].join("\n");

  const html = renderEmailLayout({
    preview: "Confirm your email address to activate your account",
    eyebrow: "Confirm your email",
    heading: "One quick step to get started",
    subheading: `${greeting} Confirm your email to finish setting up your ${company.name} account and unlock everything the studio has to offer.`,
    content:
      renderButton(url, "Verify my email") +
      renderFallbackLink(url) +
      renderFeatureCards([
        {
          title: "Secure access",
          text: "Confirming your email protects your account and keeps it recovery-ready.",
        },
        {
          title: "Studio updates",
          text: "Get production news, academy intakes, and behind-the-scenes drops.",
        },
      ]),
    note: "This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.",
  });

  return { subject, text, html };
}

/** Welcome email sent after a successful signup. */
export function welcomeEmail(name?: string | null): EmailContent {
  const subject = `Welcome to ${company.name}`;
  const greeting = name ? `Hi ${name},` : "Welcome!";

  const text = [
    greeting,
    "",
    `Thanks for joining ${company.name}.`,
    "",
    company.description,
    "",
    "What you can explore:",
    "  • Filmmaking & production",
    "  • Cinematography",
    "  • Special effect lighting",
    "  • Scriptwriting & production design",
    "  • The GM Lawason Academy for Film and Media",
    "",
    `Follow the studio: ${company.social.instagram}`,
  ].join("\n");

  const html = renderEmailLayout({
    preview: `Welcome to ${company.name} — your account is ready`,
    eyebrow: "Welcome to the studio",
    heading: `Welcome aboard, filmmaker`,
    subheading: `${greeting} Thanks for joining ${company.name}. Your account is ready — here's a quick look at what you can do next.`,
    body: [company.description],
    content:
      renderPanel(
        `<p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${
          "#a3a3a3"
        };font-family:'Segoe UI',Arial,sans-serif;">What the studio does</p>` +
          renderCheckList([
            "Filmmaking — concept to final cut",
            "Cinematography — visual storytelling",
            "Special effect lighting — light as a character",
            "Scriptwriting & production design",
          ]),
      ) +
      renderFeatureCards([
        {
          title: "Explore our work",
          text: "Browse productions, collaborations, and original series from the studio.",
        },
        {
          title: "Join the academy",
          text: "Grow from set basics to industry-ready skills with hands-on training.",
        },
      ]),
    note: "You're receiving this because you created an account with us. Need help? Just reply to this email.",
  });

  return { subject, text, html };
}

interface RegistrationEmailOptions {
  name: string;
  eventTitle: string;
  eventDate?: string | null;
  location?: string | null;
  status?: string;
}

/** Event registration confirmation. */
export function eventRegistrationEmail({
  name,
  eventTitle,
  eventDate,
  location,
  status,
}: RegistrationEmailOptions): EmailContent {
  const subject = `You're registered: ${eventTitle}`;

  const detailRows = [
    eventDate ? `Date: ${eventDate}` : null,
    location ? `Location: ${location}` : null,
    status ? `Status: ${status}` : null,
  ].filter(Boolean) as string[];

  const text = [
    `Hi ${name},`,
    "",
    `Your registration for "${eventTitle}" is confirmed.`,
    "",
    ...detailRows,
    "",
    `We look forward to having you.`,
    `— ${company.name}`,
  ].join("\n");

  const rows = [
    eventDate ? renderInfoRow("Date", eventDate) : "",
    location ? renderInfoRow("Location", location) : "",
    status
      ? renderInfoRow("Status", status, true)
      : location
        ? renderInfoRow("Location", location, true)
        : eventDate
          ? renderInfoRow("Date", eventDate, true)
          : "",
  ]
    .filter(Boolean)
    .join("");

  const html = renderEmailLayout({
    preview: `Registration confirmed for ${eventTitle}`,
    eyebrow: "Registration confirmed",
    heading: `You're all set, ${name.split(" ")[0]}`,
    subheading: `Your spot for "${eventTitle}" is reserved. Here are the details.`,
    content:
      renderPanel(
        `<p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${"#0a0a0a"};font-family:'Segoe UI',Arial,sans-serif;">${escapeHtml(
          eventTitle,
        )}</p>${renderDivider()}${rows || `<p style="margin:0;font-size:13px;color:${"#525252"};font-family:'Segoe UI',Arial,sans-serif;">Details will follow closer to the event.</p>`}`,
      ) +
      renderPanel(
        `<p style="margin:0;font-size:12.5px;line-height:1.6;color:#166534;font-family:'Segoe UI',Arial,sans-serif;">✓&nbsp; Confirmed — no further action needed. We'll send reminders before the event.</p>`,
        "success",
      ),
    note: `You received this because you registered for an event with ${company.name}. If this wasn't you, please contact us.`,
  });

  return { subject, text, html };
}
