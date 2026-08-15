# GM Lawason Studios

Next.js app for [GM Lawason Studios](https://www.instagram.com/gmlawasonstudios/) — filmmaking, cinematography, special effect lighting, academy programmes, and the studio YouTube channel.

## Stack

- **Next.js 16** (App Router)
- **Postgres** + **Prisma**
- **Auth.js / NextAuth v5** — Google, Apple, and email/password
- **Cloudinary** — image uploads
- **YouTube Data API** — channel videos and series
- **React 19** · **Tailwind CSS v4** · **TypeScript** · **pnpm**

## What the app does

- Public marketing site (home, work, about, contact)
- **Watch** — playlists from the YouTube channel grouped as series/categories
- **Events** — summer camp and workshop registration
- **CMS pages** — admin-created pages go live at `/pages/[slug]` after publish
- **Admin dashboard** — pages, media, events, registrations, YouTube sync

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Set `DATABASE_URL` to a Postgres database, then:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

   `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local` become the first admin account.

4. Auth

   - Generate `AUTH_SECRET` with `openssl rand -base64 32`
   - Google: redirect URI `http://localhost:3000/api/auth/callback/google`
   - Apple: redirect URI `http://localhost:3000/api/auth/callback/apple`

5. Uploads and YouTube

   - Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - YouTube: `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID`. Sync from **Admin → YouTube**, or hourly via `/api/cron/youtube` with `CRON_SECRET`

6. Run the app:

   ```bash
   pnpm dev
   ```

   Sign in at `/login`, then open `/admin` with the admin account.

## Publishing content

1. Sign in as admin
2. Create a page under **Admin → Pages** (cover image, blocks, optional nav)
3. Click **Publish live** — the page is immediately available at `/pages/[slug]`
4. Create events under **Admin → Events** and set status to **Open for registration**

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Generate Prisma client and production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:migrate` | Create/apply Prisma migrations |
| `pnpm db:seed` | Seed admin user and sample summer camp |
| `pnpm db:studio` | Open Prisma Studio |

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
