import { company } from "@/lib/company";
import { getAppUrl } from "@/lib/utils";

/**
 * Shared, email-client-safe theme. Mirrors the app's brand tokens:
 * white surface, near-black text, magenta accent.
 * Inline styles + table layout are used because email clients do not support
 * external stylesheets or modern CSS.
 */
const theme = {
  background: "#f4f4f5",
  surface: "#ffffff",
  surfaceElevated: "#fafafa",
  foreground: "#0a0a0a",
  muted: "#525252",
  faint: "#a3a3a3",
  border: "#e5e5e5",
  accent: "#c026d3",
  accentDark: "#a21caf",
  accentSoftBg: "#fdf4ff",
  accentSoftBorder: "#f0abfc",
  successBg: "#f0fdf4",
  successBorder: "#bbf7d0",
  successText: "#166534",
  font: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
  mono: "'Courier New', Courier, monospace",
} as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Brand logo block used in the email header. */
function renderLogo() {
  return `<table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align:middle;">
        <div style="width:36px;height:36px;border-radius:10px;background:${theme.accent};color:#ffffff;font-size:18px;font-weight:700;text-align:center;line-height:36px;font-family:${theme.font};">G</div>
      </td>
      <td style="padding-left:10px;vertical-align:middle;">
        <span style="font-size:16px;font-weight:700;letter-spacing:-0.01em;color:${theme.foreground};font-family:${theme.font};">${escapeHtml(
          company.shortName,
        )}</span>
        <br />
        <span style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${theme.faint};font-family:${theme.font};">Studios</span>
      </td>
    </tr>
  </table>`;
}

interface EmailLayoutOptions {
  /** Preheader text shown in the inbox preview. */
  preview: string;
  /** Short label above the heading, defaults to the brand name. */
  eyebrow?: string;
  heading: string;
  /** Optional subheading under the main heading. */
  subheading?: string;
  /** Paragraph(s) of body copy (plain text, escaped). */
  body?: string[];
  /** Main content block(s) (button, code box, cards, etc). */
  content?: string;
  /** Small print below the content. */
  note?: string;
}

export function renderEmailLayout({
  preview,
  eyebrow,
  heading,
  subheading,
  body = [],
  content = "",
  note,
}: EmailLayoutOptions) {
  const paragraphs = body
    .map(
      (line) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${theme.muted};font-family:${theme.font};">${escapeHtml(
          line,
        )}</p>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${escapeHtml(heading)}</title>
    <!--[if mso]>
    <style>
      table, td, p, a { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;width:100%;background:${theme.background};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <!-- Preheader -->
    <div style="display:none;max-height:0;max-width:0;overflow:hidden;font-size:1px;line-height:1px;color:${theme.background};opacity:0;">
      ${escapeHtml(preview)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${theme.background};">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <!-- Top brand bar (outside card) -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;">
            <tr>
              <td style="padding:0 4px 18px;">
                ${renderLogo()}
              </td>
            </tr>
          </table>

          <!-- Main card -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background:${theme.surface};border:1px solid ${theme.border};border-radius:22px;overflow:hidden;">
            <!-- Accent top bar -->
            <tr>
              <td style="height:6px;background:linear-gradient(90deg, ${theme.accent} 0%, ${theme.accentDark} 100%);font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <!-- Hero -->
            <tr>
              <td style="padding:40px 40px 0;">
                ${
                  eyebrowPlaceholder(eyebrow)
                }
                <h1 style="margin:14px 0 0;font-size:27px;line-height:1.28;font-weight:700;letter-spacing:-0.02em;color:${theme.foreground};font-family:${theme.font};">${escapeHtml(
                  heading,
                )}</h1>
                ${
                  subheading
                    ? `<p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:${theme.muted};font-family:${theme.font};">${escapeHtml(
                        subheading,
                      )}</p>`
                    : ""
                }
              </td>
            </tr>

            ${
              paragraphs
                ? `<tr><td style="padding:22px 40px 0;">${paragraphs}</td></tr>`
                : ""
            }
            ${
              content
                ? `<tr><td style="padding:14px 40px 0;">${content}</td></tr>`
                : ""
            }
            ${
              note
                ? `<tr><td style="padding:24px 40px 0;"><p style="margin:0;font-size:12px;line-height:1.7;color:${theme.faint};font-family:${theme.font};">${escapeHtml(
                    note,
                  )}</p></td></tr>`
                : ""
            }

            <!-- Footer -->
            <tr>
              <td style="padding:36px 40px 40px;">
                ${renderDivider()}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:top;">
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:${theme.foreground};font-family:${theme.font};">${escapeHtml(
                        company.name,
                      )}</p>
                      <p style="margin:0;font-size:12px;line-height:1.7;color:${theme.faint};font-family:${theme.font};">
                        ${escapeHtml(company.tagline)}<br />
                        ${escapeHtml(company.location)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:16px;">
                      ${renderSocials()}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Legal / disclaimer -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;">
            <tr>
              <td style="padding:20px 12px 0;">
                <p style="margin:0;font-size:11px;line-height:1.7;color:${theme.faint};text-align:center;font-family:${theme.font};">
                  You received this email because an action was requested on your ${escapeHtml(
                    company.shortName,
                  )} account.<br />
                  © ${new Date().getFullYear()} ${escapeHtml(company.name)}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function eyebrowPlaceholder(eyebrow?: string) {
  const label = eyebrow ?? company.shortName;
  return `<p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${theme.accent};font-family:${theme.font};">${escapeHtml(
    label,
  )}</p>`;
}

export function renderDivider() {
  return `<div style="height:1px;background:${theme.border};margin:0 0 22px;font-size:0;line-height:0;">&nbsp;</div>`;
}

/** Primary call-to-action button. */
export function renderButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0;">
    <tr>
      <td align="center" style="border-radius:14px;background:${theme.accent};box-shadow:0 6px 18px rgba(192,38,211,0.28);">
        <a href="${href}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:14px;font-family:${theme.font};">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/** Large monospace code box for OTPs. */
export function renderCodeBox(code: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
    <tr>
      <td style="background:${theme.accentSoftBg};border:1px dashed ${theme.accentSoftBorder};border-radius:16px;padding:26px;text-align:center;">
        <span style="display:inline-block;font-size:38px;font-weight:700;letter-spacing:0.42em;color:${theme.foreground};font-family:${theme.mono};">${escapeHtml(
          code,
        )}</span>
      </td>
    </tr>
  </table>`;
}

/** A bordered panel used to group content. */
export function renderPanel(inner: string, tone: "default" | "success" | "info" = "default") {
  const bg =
    tone === "success"
      ? theme.successBg
      : tone === "info"
        ? theme.accentSoftBg
        : theme.surfaceElevated;
  const border =
    tone === "success"
      ? theme.successBorder
      : tone === "info"
        ? theme.accentSoftBorder
        : theme.border;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
    <tr>
      <td style="background:${bg};border:1px solid ${border};border-radius:16px;padding:20px 22px;font-family:${theme.font};">
        ${inner}
      </td>
    </tr>
  </table>`;
}

/** Key/value detail row inside a panel. */
export function renderInfoRow(label: string, value: string, isLast = false) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding:9px 0;border-bottom:${isLast ? "none" : `1px solid ${theme.border}`};vertical-align:top;">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${theme.faint};font-family:${theme.font};">${escapeHtml(
          label,
        )}</span>
      </td>
      <td align="right" style="padding:9px 0;border-bottom:${isLast ? "none" : `1px solid ${theme.border}`};vertical-align:top;">
        <span style="font-size:14px;font-weight:600;color:${theme.foreground};font-family:${theme.font};">${escapeHtml(
          value,
        )}</span>
      </td>
    </tr>
  </table>`;
}

/** Checkmark list of items (e.g. what's included). */
export function renderCheckList(items: string[]) {
  const rows = items
    .map(
      (item) => `<tr>
        <td style="width:22px;vertical-align:top;padding:5px 0;">
          <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${theme.accentSoftBg};color:${theme.accent};font-size:11px;font-weight:700;text-align:center;line-height:16px;font-family:${theme.font};">✓</span>
        </td>
        <td style="padding:5px 0 5px 10px;font-size:14px;line-height:1.6;color:${theme.muted};font-family:${theme.font};">${escapeHtml(
          item,
        )}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0;">${rows}</table>`;
}

/** Two-up "next steps" feature cards. */
export function renderFeatureCards(cards: Array<{ title: string; text: string }>) {
  const cells = cards
    .map(
      (card) => `<td style="width:50%;padding:8px;vertical-align:top;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${theme.surfaceElevated};border:1px solid ${theme.border};border-radius:14px;">
          <tr>
            <td style="padding:16px;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${theme.foreground};font-family:${theme.font};">${escapeHtml(
                card.title,
              )}</p>
              <p style="margin:0;font-size:12.5px;line-height:1.6;color:${theme.muted};font-family:${theme.font};">${escapeHtml(
                card.text,
              )}</p>
            </td>
          </tr>
        </table>
      </td>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px -8px;"><tr>${cells}</tr></table>`;
}

export function renderFallbackLink(url: string) {
  return `<p style="margin:16px 0 0;font-size:12px;line-height:1.7;color:${theme.faint};word-break:break-all;font-family:${theme.font};">
    If the button doesn't work, copy and paste this link into your browser:<br />
    <a href="${url}" style="color:${theme.accent};text-decoration:underline;">${escapeHtml(
      url,
    )}</a>
  </p>`;
}

function renderSocials() {
  const link = (href: string, label: string) =>
    `<a href="${href}" target="_blank" rel="noopener" style="display:inline-block;margin-right:8px;padding:6px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${theme.muted};text-decoration:none;border:1px solid ${theme.border};border-radius:999px;font-family:${theme.font};">${escapeHtml(
      label,
    )}</a>`;

  return `${link(company.social.instagram, "Instagram")}${link(
    company.social.linkedin,
    "LinkedIn",
  )}${link(getAppUrl(), "Website")}`;
}

export { escapeHtml, theme };
