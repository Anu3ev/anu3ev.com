# Editable content and publication review

Reviewed the real editing journey: update profile/page content, preserve valid translations and produce consistent HTML, images and metadata. Long copy must not require Vue edits.

`pages.json` and `profile.json` own editorial data; Zod validates before SSG, `useSiteContent()` reads typed settings and Vue renders them. A YAML anchor shares locale widgets. Contract tests compare page, About and career fields with actual data. Removed the unused profile/SQLite collection, 70 migrated editorial fields and 34 unused labels from i18n.

Checked the complete profile graph: Home, About/photo/alt, sidebar, header/footer, article author, SEO/OG, RSS and CreativeWork. Corrected remaining literal names/photos, period formatting and editable Privacy dates. Copyright year comes from build config rather than the visitor's clock. Result counts use neutral EN/RU wording.

The second pass found a hosting issue: `/blog` redirected to `/blog/`, but canonical identified the redirect. Added one `canonicalPagePath()`, aligned navigation/alternates/sitemap/RSS/schema/CMS previews/Vercel, and made sitemap tests require **200 without redirects**. The fixture supplies an origin ending in slash; JSON-LD tests reject duplicate slashes. Updated eight verified Markdown links.

Frontmatter uses YAML 1.2 and rejects executable engines. The first implementation raised inventory's Fallow cognitive score to 18. Extracted meaningful format/encoding/parser policy into `readEditorialSource`, leaving enumeration with its existing owner. Repeated analysis found zero dead code, cycles, boundaries, complexity or clones, without suppressions. Removed an unreachable path fallback after establishing the canonical invariant.

Fixed a real Node 24 integration issue: Playwright JSON imports need `with { type: 'json' }`, previously hidden by Vitest/Vite. Browser tests no longer assume a fixed editable Blog title. One scenario checks actual CMS values, author/photo/career/Privacy/availability in both locales. The real 12-article pagination fixture uses unquoted dates and preserves search on page two/reload.

Release review found that a Release object does not guarantee successful archive upload. The job now checks expected asset name, uploaded state and nonzero size, retries a missing archive and preserves an existing valid asset. Conflicts/API failures cannot become a pass. An optional rerun of the successful release job was rejected by automatic approval review; read-only tag/asset checks were performed instead, not represented as a rerun.

`pnpm check` and SSG passed; **43 unit tests**, 100% lines/branches/functions in twelve selected pure modules. The full local browser run had **49 passed**, followed by two targeted tests after the final Privacy date field. GitHub repeats the full suite before merge. [Dependency review](dependencies.md) retains actual advisories; audit is not described as green. This was self-review, corrections and another pass, without an independent reviewer.
