# anu3ev.com

Alexander Anufriev's portfolio, built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS and Nuxt Content. Static HTML generation keeps hosting independent of a server database. English is the primary language; Russian is available under `/ru`.

**Production:** [anu3ev-com.vercel.app](https://anu3ev-com.vercel.app/) · [Content administration](https://anu3ev-com.vercel.app/admin/).

Vercel Hobby is connected to this GitHub repository. Pushes to `master` automatically build and deploy the site, including CMS updates. GitHub Actions validates content, lint, types, 51 unit tests and 56 browser/axe checks, then publishes a versioned release when the package version increases. [Deployment guide](docs/operations/deployment.md).

## Development

Use Node **24.15+ LTS** and pnpm **10.33.2**, pinned in `.node-version` and `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check
pnpm build
pnpm preview
```

`pnpm check` runs content validation, ESLint, TypeScript and unit tests. Coverage targets critical pure contracts rather than the entire UI. The static export is written to `.output/public`.

Install Chromium with `pnpm exec playwright install chromium`, then run `pnpm test:e2e`. Browser tests use one worker and build an isolated pagination fixture without changing published content. `pnpm build` generates sitemap, RSS, social cards and responsive WebP images. After changing a cover during a running development session, run `pnpm assets:prepare`.

## Content and documentation

Articles and cases live in `content/en` and `content/ru`. Author settings are in `content/settings/profile.json`; editable page copy and career history are in `content/settings/pages.json`. Sveltia CMS at `/admin/` supports paired translations and GitHub's editorial workflow. Drafts are excluded before the public database is generated. [Sign-in and editing guide](docs/operations/content.md).

[Architecture and task queue](docs/README.md) · [Automatic deployment verification](docs/tasks/08-github-deployment/summary.md) · [Manual QA and fixes](docs/tasks/09-manual-qa/summary.md). The [initial launch audit](docs/tasks/07-launch-audit/summary.md) records the historical 1.0.1 Sites snapshot. Design corrections and remaining launch tasks are tracked in the queue; the custom domain is the final step.
