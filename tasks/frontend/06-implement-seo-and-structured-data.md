# FE-06: Implement SEO and Structured Data

**Status:** Planned  
**Depends on:** FE-02, FE-03, FE-05

## Objective

Make every public page understandable, discoverable, and correctly connected to its localized equivalent.

## Deliverables

- Localized title, description, canonical, Open Graph, and social-card metadata.
- `hreflang` links for English, Russian, and `x-default` where appropriate.
- Locale-aware sitemap and robots configuration.
- Structured data for the person/site, articles, breadcrumbs, and eligible project content.
- Stable descriptive URLs and redirect rules for any replaced legacy paths.
- Share-image requirements and fallback behaviour.

## Acceptance criteria

- Canonical URLs never contain `?lang=` or tracking parameters.
- Every indexable route has self-referencing and reciprocal locale alternates.
- Structured data matches visible content and passes relevant validators.
- Draft and error routes are excluded from indexing.
- Server-rendered HTML contains primary content and metadata before client hydration.

