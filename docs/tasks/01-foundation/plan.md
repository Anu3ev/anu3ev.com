# Sequential task queue

> Historical queue, kept as written up to task 27. The current status of every task is in the [task board](../../roadmap/STATUS.md).

Each task follows requirements → implementation → checks → self-review → corrections → another review → summary → separate branch/commit → push → merge → next task. The user's Git index is preserved; commits use a temporary index. `git add` is not used.

| Task | Deliverable | Status |
| --- | --- | --- |
| 01-foundation | Repository audit, architecture, content sources and acceptance criteria | Complete |
| 02-site | Nuxt, MagicPath desktop structure, localization and real contacts | Complete initial implementation; responsive fidelity is revisited in task 11 |
| 03-content-and-cms | CMS, schemas, sourced cases/articles, images and editorial workflow | Complete; the owner performs the first personal-token sign-in |
| 04-quality-and-seo | SEO/RSS/sitemap, pagination, unit/e2e/axe and corrections | Complete |
| 05-release-and-deploy | GitHub CI/Release and public Sites snapshot | Complete historical snapshot; the original hosting access limitation was resolved in task 08 |
| 06-editable-pages | Editable page copy/career, canonical URLs, YAML and dependency fixes | Complete; PR 6 merged and Release 1.0.1 verified |
| 07-launch-audit | Exact CI archive publication and guest production verification | Complete for the historical 1.0.1 snapshot |
| 08-github-deployment | Vercel Hobby Git integration and automatic public deployment | Complete; versioned deployments and admin cache headers verified |
| 09-manual-qa | Manual testing, search focus/typing, filter history, contents and hydration fixes | Complete; 1.0.5 published, 52 local browser checks and 4 focused public checks passed |
| 10-english-repository | English documentation and repository/CMS interface text | Complete; PR 12 merged after successful CI |
| 11-design-fidelity | Actual MagicPath layouts, dimensions and spacing at 402×874, 1133×744 and 1440×1024 | Complete; PR 13 merged after successful 55-test CI |
| 12-external-links | External web links open in a new tab with the appropriate rel attributes | Complete; PR 14 merged after successful 51-unit/56-browser CI |
| 13-blog-all-topics | Reproduce and fix missing categories under All topics, including navigation from Home | Complete; 1.0.9 makes category labels searchable, 58 browser checks passed |
| 14-link-block-spacing | Correct internal spacing of link blocks, including hover/focus on desktop and mobile | Complete in 1.0.10; row design superseded by task 16 |
| 16-touch-hover-and-link-rows | Stuck touch hover in the bottom navigation and full-width contact link rows | Complete; 1.0.11, 63 browser checks passed; the topic report was the missing preview images (task 17) |
| 17-cover-and-post-images | Cover text clear of shapes, Let's talk below the cover, cover image on every article preview | Complete; 1.0.12, 66 browser checks passed |
| 15-custom-domain | Connect anu3ev.com through Zomro and verify DNS, HTTPS, metadata and redirects | Complete; 1.0.13 on Vercel DNS, www and vercel.app redirect permanently |
| 18-post-preview-images | Article preview images at the same size as the article cover | Complete; 69 browser checks passed |
| 19-ui-copy-review | Russian interface copy rewritten phrase by phrase with the anti-cringe checklist | Complete |
| 20-profile-photo | Real photo instead of the text avatar, editable avatar field | Complete; 69 browser checks passed |
| 21-brand-logo | "3." mark and anu3ev.com wordmark, favicon, app icons and default social card | Complete; 69 browser checks passed |
| 22-home-positioning | Home headline, bio, proof points and tags from the ABCD plan and verified CV metrics | Complete; 69 browser checks passed |
| 23-portfolio-cases | Ten bilingual case studies with verified key results, raw screenshots or honest diagrams | Complete; 69 browser checks passed |
| 24-blog-articles | Five bilingual technical articles from five projects | Complete; 1.1.0 releases tasks 18–24 |
| 27-mobile-polish | Owner phone review: card header, proof tiles, Let's talk row, email icon, compact outline | Complete; 69 browser checks passed |

The former plans, HTML prototype and remaining old inventory were removed at the user's request. Useful images were retained as source material; facts were checked against current Obsidian notes. All new requests remain in order, with domain connection explicitly reserved for the final stage.
