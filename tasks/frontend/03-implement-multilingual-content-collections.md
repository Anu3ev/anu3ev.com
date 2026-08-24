# FE-03: Implement Multilingual Content Collections

**Status:** Planned  
**Depends on:** DES-01, FE-02

## Objective

Create type-safe, version-controlled content models for pages, projects, and articles with mandatory English and Russian parity.

## Deliverables

- Nuxt Content collections for projects, articles, and page content.
- Shared content identity through a stable `translationKey`.
- Localized slug, title, description, body, and SEO fields.
- Project fields for context, constraints, role, decisions, outcomes, metrics, media, and related writing.
- Article fields for publication date, update date, tags, reading metadata, and related work.
- Build-time validation that both locale variants exist before publication.

## Acceptance criteria

- Collection queries are type-safe.
- Published content cannot exist in only one supported locale.
- Localized slugs resolve to the same logical content item.
- Draft content is excluded from production and sitemap output.
- Invalid frontmatter produces a clear fail-fast build error.
- Content stores facts and presentation metadata, not transient UI state.

