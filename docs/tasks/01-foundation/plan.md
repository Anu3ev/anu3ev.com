# Sequential task queue

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
| 12-external-links | External web links open in a new tab with the appropriate rel attributes | In progress; includes the Privacy email found during the link audit |
| 13-blog-all-topics | Reproduce and fix missing categories under All topics, including navigation from Home | Queued after external links |
| 14-custom-domain | Connect anu3ev.com through Zomro and verify DNS, HTTPS, metadata and redirects | Required final task, after the site changes are complete |

The former plans, HTML prototype and remaining old inventory were removed at the user's request. Useful images were retained as source material; facts were checked against current Obsidian notes. All new requests remain in order, with domain connection explicitly reserved for the final stage.
