# 04 — Quality, SEO and performance

Built static SEO infrastructure for 28 canonical pages: sitemap, robots, EN/RU RSS, hreflang/x-default, Open Graph/Twitter, 1200×630 raster social images, Person/WebSite, BlogPosting, CreativeWork and BreadcrumbList. Dates, canonical and JSON-LD agree. Unknown and draft URLs return HTTP 404.

Added browser/axe checks, HTML reading without JavaScript and a separate real Nuxt SSG fixture with 12 articles per language. Synthetic content is never published. HTML route generation and sitemap share pagination policy.

Measurements led to fixes for the blocking theme request, duplicate font preload hydration, responsive covers, image dimensions, eager destination prefetch and mobile CTA contrast. [Home screenshot](home-desktop.webp), [Blog](blog-desktop.webp), [Russian mobile](home-ru-mobile.webp). Screenshots at this stage demonstrate the initial layout, not completed responsive fidelity against the later supplied reference.

| Check at this stage | Actual result/scope |
| --- | --- |
| ESLint / Nuxt typecheck / SSG | Pass, no compiler warnings/diagnostics |
| Unit / V8 | 27 passed; 100% lines/branches/functions in nine selected pure modules, not the entire app |
| Full browser suite | 46 passed, zero skipped, Chromium, one worker |
| Final font-hydration follow-up | Five targeted tests passed, including the new regression; 47 e2e tests defined in total |
| Desktop Lighthouse | 100/100/100/100; LCP 0.5 s, CLS 0, TBT 0 ms |
| Mobile Lighthouse | Optimized result 98/100/100/100; LCP 2.2 s, CLS 0, TBT 20 ms; exact final measurement in the JSON report |
| Font hydration | Two RU preloads, two actual font requests, zero console errors/warnings |
| Fallow | Warn; zero dead code, unused imports/exports, cycles, boundaries, function complexity or duplication findings; heuristics reviewed |

The first full browser run failed on actual accessibility/canonical defects and two incorrect test-locator assumptions. After corrections, five representative scenarios passed, then the full set. Initial mobile Lighthouse was 86/96/100/100; it is not presented as an initial pass.

[Review](review.md) records corrections and retained warnings; [reports](reports/lighthouse-summary.json) preserve actual measurements. Articles were not backdated; the current CV confirms the frontend role ended in September 2026.

Core Web Vitals were measured **in the lab**. Field INP/CrUX require real visits; automated checks do not certify full WCAG compliance. The owner's first personal-token CMS write and independent review were not performed.
