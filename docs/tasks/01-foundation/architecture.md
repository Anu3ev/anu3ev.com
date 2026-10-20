# Architecture

## Product contract

A Vue/TypeScript engineer's portfolio: Home, project listing, case study, Blog, article, About, Contacts, Privacy and a real 404. Contact actions use existing email, Telegram and LinkedIn destinations. There is no simulated contact submission.

English is primary; Russian uses `/ru`. Both locales share slugs so the language switch preserves the corresponding page. Blog pages contain at most ten articles, have their own indexable URLs and return 404 for missing pages. The four main navigation destinations are Home, Blog, Portfolio and Contacts; About is available through the profile.

## ADR-001: Nuxt 4, Vue 3, TypeScript and static generation

The public site does not need personalization or a private API. `nuxt generate` creates HTML for every page, making copy available to search engines, reducing TTFB and avoiding a persistent server/database. The generated files remain portable between hosts.

```text
app/
  assets/css/       Design tokens and shared typography
  components/      Cohesive reusable UI components
  composables/     Nuxt-owned localization and SEO
  layouts/         Shared page shell
  pages/           Routes and page behavior
  queries/         Published content projections and ordering
  utils/           Pure pagination and URL contracts
content/
  en/, ru/         Markdown cases and articles
  settings/        Editable author and page information
public/
  admin/           Sveltia CMS and declarative editor schema
  images/          Optimized public images
scripts/           Metadata, content checks, images and releases
shared/            Build/client schemas and pure contracts
tests/
  unit/            Critical pure contracts
  e2e/             Public user journeys and axe
.github/workflows/ Checks and versioned releases
docs/tasks/        Decisions, reviews and task summaries
```

Nuxt Content stores articles/cases in Git, validates their schema and exposes typed queries. Publication respects `published`, locale and date. Drafts must not reach HTML, payloads, RSS, sitemap or the public SQL export.

Home/Blog define a three-column personal-space layout: left navigation, a central feed and a right profile. Portfolio/Contacts inherit the blue palette. Tailwind uses its official Vite plugin; semantic CSS classes own stable components and design tokens. Add Pinia only for actual shared domain state; the current Vue/Nuxt state is sufficient.

## ADR-002: Sveltia CMS and GitHub

`/admin/` provides a free open-source Markdown editor, article fields, covers, dates, categories, projects, profile settings and page copy. GitHub permissions enforce authorization. No token is embedded in source or public builds.

For one technical owner, use Sveltia's supported fine-grained GitHub personal access token login, restricted to this repository: Contents read/write and Pull requests read/write for the editorial workflow. Sveltia stores the token in browser localStorage. This is a material tradeoff: use a trusted device and sign out on shared devices; it is not a server session or configured OAuth.

CMS commits pass content checks and CI. Articles/projects use paired locale editing and an editorial PR workflow; settings use simple commits to master. A future multi-editor setup could add a free Cloudflare Worker OAuth service after registering a GitHub OAuth App. It is not required for token login.

References: [Sveltia GitHub backend](https://sveltiacms.app/en/docs/backends/github), [Nuxt Content static hosting](https://content.nuxt.com/docs/deploy/static).

## ADR-003: Free publication

Keep `Anu3ev/anu3ev.com` private. The existing Vercel Hobby workspace hosts the static project through GitHub integration, without a paid trial, database, functions or analytics SDK. GitHub Pages remains a portability option if the existing Teams entitlement supports it; repository visibility need not change.

Production currently uses `https://anu3ev-com.vercel.app`. The initial API access failure was resolved through the owner's authorized browser session in task 08. The user subsequently required **anu3ev.com as the final launch step**, after site corrections. Connect DNS through Zomro, verify public HTTPS, then update the shared canonical origin and rebuild. Do not publish canonical URLs pointing at an unreachable future domain.

CI installs from the lockfile, validates content, lint, types, unit tests, SSG, browser journeys and accessibility. A higher stable package version creates a semver tag, GitHub Release and the exact tested archive. Vercel independently builds the same master commit; deployment may complete before the release job. Branch protection and deployment checks are not configured and must not be claimed as an enforced merge gate.

## ADR-004: SEO and performance

Each indexable page has a unique title/description, canonical, Open Graph, Twitter card, document language and equivalent hreflang alternatives. JSON-LD uses Person/WebSite on Home, BreadcrumbList internally, BlogPosting for articles and CreativeWork for cases. Escape `<` when serializing inline JSON-LD.

Sitemap contains only published canonical routes. Robots advertises sitemap and excludes admin; robots is not authorization. Both locales have RSS. Admin and 404 are noindex. Paginated pages retain their own canonical instead of all pointing to page one. Dates and headings come from content rather than the visitor's clock.

Images include dimensions and responsive WebP, with below-the-fold lazy loading and a priority hero. Fonts are local with `font-display: swap`. Heavy editors/iframes do not load in the shared shell. Respect reduced motion. Lighthouse is a laboratory measurement; field Core Web Vitals, INP and CrUX require real traffic.

## ADR-005: Future project playgrounds

Cases already have stable slugs and optional public repository/demo URLs. Future `/playground/:slug` pages should load lazily, with isolated state and cleanup. Do not import Monaco, FabricJS or TinyMCE into the shared layout. If an iframe becomes necessary, give it a title, explicit load action, sandbox and scoped permissions. Private inSales code and customer data remain unpublished.

## ADR-006: Editable page copy and canonical URLs

`content/settings/pages.json` owns bilingual page copy, career history, tools and principles; `profile.json` owns names, photo and contacts. Sveltia provides grouped page fields, a shared locale widget schema and a career list. `useSiteContent()` reads typed static data, validated with Zod before SSG. i18n holds short UI labels. Avoid an unused duplicate Content/SQLite collection for JSON settings.

The initial Sites host redirected `/blog` to `/blog/`; navigation, canonical, sitemap, RSS and JSON-LD therefore use directory URLs with trailing slashes. Vercel preserves that policy. Sitemap tests forbid following redirects. Origin normalization after runtime environment overrides and path normalization have separate owners; query strings and fragments cannot enter canonical URLs.

## Design access and remaining fidelity work

The new design source is MagicPath `463007080014573568`. Its API quota was exhausted and anonymous access redirected home. After the owner signed in, the four desktop previews were inspected in the browser and captured in `docs/reference/magicpath`.

The owner later supplied explicit mobile/tablet/browser references at 402×874, 1133×744 and 1440×1024. The initial mobile layout was inferred from desktop and does not match the fixed bottom navigation. Task 11 must inspect actual responsive previews and correct dimensions, spacing and UI across all four screens. Functional browser checks alone do not establish design fidelity.

## Applying code-writer

The entire Obsidian source and installed skill directory matched, and both validations passed. The initial Fallow baseline had no JS/TS entry points; zero findings did not measure the future application.

Validate external input with schemas and meaningful preconditions; pagination checks page/page-size boundaries. The literal minimum-two-runtime-assertions-per-function rule conflicts with the ban on defensive noise in simple Vue computed values, library callbacks and the theme handler, whose internal contracts Nuxt/Vue already guarantee. Within the user's authorization to make technical decisions, omit fake assertions in those specific places. This is an explicit exception to the literal counter, not a claim of compliance with it. Test behavior and validate external boundaries.

Own functions have useful JSDoc, object parameters for multiple arguments, a flat reading order, no recursion and no `any`. Components follow actual ownership; no tiny helpers solely for line counts. Define keyboard/focus/error acceptance before UI changes. Each stage gets self-review, corrections and another targeted pass; self-review is never described as independent review.
