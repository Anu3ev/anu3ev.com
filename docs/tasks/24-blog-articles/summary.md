# 24 — Five blog articles

The three placeholder posts, all about the image editor, are replaced by five long-form articles in English and Russian. Each comes from a different project. Topics were chosen from the owner's notes: the strongest stories with a misleading first symptom, a decision with trade-offs and a verifiable result. Generic topics were excluded. The writing follows the `linkedin-writer` voice in its technical-case genre, uses `anti-cringe-copy` for both languages, and treats `tailor-alexander-resume` as the truth gate for every number.

| Article | Category | Core of the story | Related case |
|---|---|---|---|
| Vue 3 didn't make our autocomplete slow. 244,650 comparisons did | Performance | Quadratic `uniqWith(isEqual)` through Proxies; remove the work first, then `toRaw`; why comparing by id was rejected; test the contract with `onTrack`, not timing | — |
| Replacing a cache timer with "has this product changed?" | Performance | `updated_at` from Liquid + IndexedDB instead of a TTL; preview vs full responses in one cache; ≈70% fewer requests, 5+ s → 2–3 s on heavy pages (representative) | storefront-product-loading |
| The redesign removed the sidebar, and with it the only way to fix a broken page | Product UX | A gap in an approved design found during implementation; a recovery mode that works without the iframe; 90%+ of stores, 60% → 80% first-session success | visual-storefront |
| One CAPTCHA token, two waiting forms | Architecture | A token resuming the wrong form; an idempotent script loader; the August 2025 rollback caused by stores without a settings record | form-protection |
| Teaching Monaco to read Liquid templates | Browser editors | Monarch state stack for HTML + Liquid with JS/CSS islands; cursor-language-aware completion; shipped as a versioned package with a 3-function API | monaco-editor |

**Rules applied.** Code snippets are rewritten as illustrations, with no internal paths, tickets or colleague names; one colleague is credited generically. Numbers come from sources with their limits. There is no time after the Vue fix (the article says the delay disappeared), the CAPTCHA conversion and v2→v3 claims are absent, and the Monaco usability figures are absent. Covers are SVG diagrams at the 1200×630 social-card size. Publication date: 2026-10-21 for all five, with no back-dating.

**Open questions for the owner**
1. Is there a measured time after the Vue 3 fix?
2. Which Liquid variable is behind `data-product-updated-at`? The article shows `product.updated_at`.
3. Are you comfortable describing the August 2025 CAPTCHA rollback publicly?
4. May the article name the Monaco `window` API functions?
5. How was the 60% → 80% first-session success measured (period, sample)?

**Checks.** `pnpm check` (52 unit tests; content has 10 article translations), `pnpm build` and 69/69 browser/axe checks pass. Rendered review: blog list (EN, 1440) and a Russian article (402).

Version **1.1.0** releases tasks 18–24 together.
