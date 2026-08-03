# GM Lawason Studios

Next.js app for [GM Lawason Studios](https://www.instagram.com/gmlawasonstudios/) — filmmaking, cinematography, and special effect lighting.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Auth.js / NextAuth v5** (Google OAuth)
- **TypeScript**
- **pnpm** (package manager)
- **Sonner** (toasts) · **Framer Motion** (animations) · **Zod** (validation)

## Project structure

```
app/                     # App Router
├── (marketing)/         # Pages with shared SiteHeader + SiteFooter
│   ├── page.tsx         # Home
│   ├── services/
│   ├── work/
│   ├── contact/
│   ├── privacy/
│   └── terms/
├── about/               # Landing layout (HomeNavbar + sections + HomeFooter)
└── api/
src/
├── components/
│   ├── landing/         # Landing page components (home-navbar, about/*, …)
│   ├── layout/          # Site header, footer, nav
│   └── …
```

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Configure Google OAuth at [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`

4. Generate an auth secret:

   ```bash
   openssl rand -base64 32
   ```

   Set the output as `AUTH_SECRET` in `.env.local`.

5. Run the dev server:

   ```bash
   pnpm dev
   ```

## Theme

The app uses a **white · green · black** brand palette for GM Lawason Studios.

- **Theme context** supports `light`, `dark`, and `system` modes
- Defaults to **system** and follows `prefers-color-scheme`
- Preference is persisted in `localStorage` under `gmlawason-theme`
- **Custom scrollbar** — configured in `src/styles/scrollbar.css`, auto-hides when idle

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `pnpm dev`    | Start dev server         |
| `pnpm build`  | Production build         |
| `pnpm start`  | Start production server  |
| `pnpm lint`   | Run ESLint               |

## Documentation

| File | Description |
| ---- | ----------- |
| [LICENSE](./LICENSE) | MIT license |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Community guidelines |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guide |
| [SECURITY.md](./SECURITY.md) | Vulnerability reporting |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [PRIVACY.md](./PRIVACY.md) | Privacy statement |
| [TERMS.md](./TERMS.md) | Terms & conditions |
