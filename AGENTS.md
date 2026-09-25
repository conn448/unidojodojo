# UniDojo — agent notes

This repository is self-hosted: it builds with plain Vite and deploys as a
static site to GitHub Pages via `.github/workflows/deploy-pages.yml`.

It is no longer connected to Lovable. Do not reintroduce `@lovable.dev/*`
dependencies or Lovable-specific runtime hooks.

## Deploy

- `bun run build` emits the publishable site to `dist/client`.
- Pushing to `main` triggers the Pages workflow, which copies that directory,
  writes `index.html` to `404.html` so deep links resolve, and publishes.
- Production assets are served from the `/unidojodojo/` base path, set in
  `vite.config.ts`. Keep local development at `/`.

