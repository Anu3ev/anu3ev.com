# FE-02: Implement i18n Routing and the Translation Contract

**Status:** Planned  
**Depends on:** DES-02, FE-01

## Objective

Implement canonical English and Russian routes with complete translation parity and predictable locale switching.

## Deliverables

- Nuxt i18n configuration with `en` as default and `ru` as the prefixed locale.
- `prefix_except_default` routing strategy.
- Typed locale definitions and lazy-loaded translation messages.
- Localized route helpers for links and dynamic parameters.
- Optional `?lang=en|ru` alias handling that redirects to canonical routes.
- Locale persistence without automatic IP-based or browser-language redirection.
- Missing-translation detection in development and CI.

## Acceptance criteria

- English routes have no prefix and Russian routes use `/ru/`.
- Switching locale preserves the equivalent current page and localized slug.
- Query aliases never appear in canonical, alternate, navigation, or sitemap URLs.
- Missing translation keys fail an automated check.
- Page HTML exposes the correct `lang` value for every route.

