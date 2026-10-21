# 23 — Portfolio case studies

The portfolio now has 10 case studies in English and Russian, sourced from the owner's notes. It covers the 9 projects with finished decks plus Form Protection, the pending tenth.

**Sources.** The main sources were "Поиск работы/Мои проекты" and the slide copy, plans and research notes in "Поиск работы/Презентации". The `tailor-alexander-resume` skill acted as the truth gate: verified metrics, attribution limits and withdrawn claims. Each case was written with the `anti-cringe-copy` skill, and the Russian was written for Russian norms, not translated.

**Model changes**
- Projects have an optional `results` list (value + label, at most 4). It is CMS-editable and shown as a strip on the case page and as the first two highlights on portfolio cards. Every number states what it counts and whose result it is.
- Inline Markdown images must point to existing `/images/` files and are validated like covers, with a unit test. Remote and missing screenshots fail the build.

**Cases (order)**

| # | Case | Key results |
|---|---|---|
| 1 | Product image editor (featured) | 3,000+ active clients · 800+ AI operations a day · 10 images in 2–3 min instead of 5–10 min · 2 production contexts |
| 2 | Visual site editor redesign | 90%+ of stores · first-session success 60% → 80% (percentage points, defined) · ≈17% wider preview at 1920 px |
| 3 | Open-source image editor core | >2× faster image loading · 4 export formats; GitHub/npm signals in the body, dated |
| 4 | Abandoned carts | 200+ paid subscribers · 15% of one merchant's customers returned (inSales case, May 2025) |
| 5 | Storefront product loading | ≈70% fewer product requests · 2–3 s instead of 5+ s on heavy pages (representative) · 10+ templates checked |
| 6 | CommonJS storefront library | compressed bundle 300+ KB → 168 KB |
| 7 | Monaco code editor | 5 interfaces · primary maintainer 3+ years |
| 8 | Multi-warehouse carts | no metric of his own; one merchant's 21% partner-warehouse share appears as context only |
| 9 | Product options | qualitative results only |
| 10 | Form protection | 2 providers · 3 checkout generations · 4 form families |

**Images.** Covers and inline images are raw UI screenshots taken from the decks' media, fresh screenshots of the live library demo, or real demo-store captures. No rendered slides were used. Multi-warehouse carts has only AI mockups and Form Protection has no screenshots, so both use honest SVG diagrams instead, as do the two storefront-library topics. A personal email visible in two abandoned-cart screenshots was cropped out; two screenshots with edited-looking demo numbers were not used. The six old case covers were removed.

**Claims deliberately left out:** the withdrawn Monaco 64%→82% and "3 days"; the invented abandoned-cart conversion examples; the CAPTCHA "+3%" and "v2→v3"; attaching 3,000+ or 800+ to the library; any single feature at 60,000 merchants; "server-side caching". The library case also no longer says that coding agents wrote the October 2026 code.

**Owner answers (2026-10-21).** The visual site editor redesign ran May–August 2024; the grouped multi-warehouse update shipped to production as described; the Hited store stays named, following the public inSales case. Later the same day the owner confirmed September 2026 for the site-editor release, and supplied the LinkedIn project periods. All ten cases now use those exact ranges (Form Protection, which is not on LinkedIn yet, uses Oct 2023 – Jul 2026 from the notes).

**Checks.** `pnpm check` (content, ESLint, types, 52 unit tests), `pnpm build` and 69/69 browser/axe checks pass. The portfolio list and three case pages were checked in screenshots (EN/RU, 1440/402): no failed requests, and the results strip and card highlights render. One result value that wrapped badly ("5–10 → 2–3 min") was rewritten as "2–3 min" with the baseline in the label.
