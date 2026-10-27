# anu3ev.com

The source of [anu3ev.com](https://anu3ev.com/), the portfolio of Alexander Anufriev, a senior frontend engineer working with Vue and TypeScript. The site has case studies of products I built at inSales and in open source, technical articles, certificates and recommendations from colleagues, in English and Russian (`/ru`).

## Stack

- **Nuxt 4** with static generation: every page is plain HTML on a CDN, with no server or database.
- **Vue 3** and **TypeScript**, styled with **Tailwind CSS 4** and a small set of design tokens.
- **Nuxt Content** for Markdown cases, articles and recommendations, checked by **zod** schemas at build time.
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** at `/admin/`: a Git-based editor that saves content as commits and pull requests. It is served from this site and signs in with a GitHub token, so there is no backend.
- **Vercel** builds and deploys every merge to `master`.

## How quality is checked

`pnpm check` and the browser suite run on every pull request.

- **Content is validated before anything is generated:**
  - schemas for every case, article, certificate and recommendation;
  - existing images and CV files;
  - no raw HTML in Markdown;
  - recommendation quotes that must match the original text word for word.
- **Unit tests** (Vitest) cover the content rules, SEO and structured data, the generated `llms.txt`, and a spacing standard that keeps every padding and gap on the token scale.
- **Browser tests** (Playwright) run against the static build:
  - navigation and the language switch;
  - pagination and search;
  - the scrollable phone menu;
  - metadata and external links.
- **Accessibility tests:** axe checks WCAG 2.2 AA on every page template in both languages and both themes. Each template must also reflow at 320 px without horizontal scrolling.
- **Search and AI tools:** besides HTML, the build generates a sitemap, RSS, social cards, `llms.txt` and a Markdown copy of each case, article and recommendation.

## Run it locally

Node 24.15+ and pnpm 10.33 (pinned in `package.json`):

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev                 # development server
pnpm check               # content validation, ESLint, type check and unit tests
pnpm build               # static site in .output/public
pnpm exec playwright install chromium
pnpm test:e2e            # browser and accessibility tests against the build
```

## How the work is organised

Each change is a task with its own branch and pull request:
- the [task board](docs/roadmap/STATUS.md) lists every task, its status and its release;
- the [roadmap](docs/roadmap/README.md) sets what comes next;
- each task folder in [`docs/tasks/`](docs/tasks/) has a plan written before the work and a summary written after it.

Operations guides: [editing content](docs/operations/content.md) and [deployment](docs/operations/deployment.md).

## License

- **Code:** under the [MIT license](LICENSE).
- **Content:** the texts in `content/`, the photos and screenshots in `public/images/` and the CV files in `public/cv/` are not covered by the MIT license; all rights reserved. Product screenshots show the products they describe and belong to their owners.
- **Recommendations:** each text in `content/recommendations/` belongs to its author. It is published with a link to the original on LinkedIn.
