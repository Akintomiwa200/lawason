# Contributing

Thank you for your interest in contributing to the GM Lawason Studios web application.

## Getting started

1. Fork the repository and clone it locally.
2. Install [pnpm](https://pnpm.io/) if you haven't already.
3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

## Development workflow

- Create a feature branch from `main`.
- Follow existing code conventions (TypeScript, App Router, `src/` structure).
- Run lint before submitting:

  ```bash
  pnpm lint
  ```

- Keep commits focused and write clear commit messages.

## Pull requests

1. Update documentation if your change affects setup, env vars, or behavior.
2. Add a concise description of **what** changed and **why**.
3. Link any related issues.
4. Ensure the project builds:

   ```bash
   pnpm build
   ```

## Code style

- Use TypeScript for all new files.
- Prefer existing utilities in `src/lib/` and components in `src/components/`.
- Match the project's **white · green · black** theme tokens in `app/globals.css`.
- Keep changes minimal and scoped to the task.

## Reporting bugs

Open an issue with:

- Steps to reproduce
- Expected vs. actual behavior
- Browser/OS and Node.js version
- Screenshots or logs if applicable

## Questions

Reach out via [Instagram](https://www.instagram.com/gmlawasonstudios/) or [LinkedIn](https://www.linkedin.com/in/godwin-lawani-8b208794).

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.
