# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a vulnerability

If you discover a security vulnerability, please **do not** open a public issue.

Instead, report it responsibly by contacting the studio through one of these channels:

- [Instagram — @gmlawasonstudios](https://www.instagram.com/gmlawasonstudios/)
- [LinkedIn — Godwin Lawani](https://www.linkedin.com/in/godwin-lawani-8b208794)

Include as much detail as possible:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to acknowledge reports within **72 hours** and will work with you on a resolution before any public disclosure.

## Security best practices for contributors

- Never commit secrets (`.env.local`, API keys, OAuth credentials).
- Keep dependencies updated (`pnpm update`).
- Use strong, unique values for `AUTH_SECRET` in production.
- Restrict Google OAuth redirect URIs to trusted domains only.
- Run production over HTTPS.

## Known dependencies

This project uses Auth.js (NextAuth), Google OAuth, and Next.js. Monitor advisories for these packages and apply patches promptly.
