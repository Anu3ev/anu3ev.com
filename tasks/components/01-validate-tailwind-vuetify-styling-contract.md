# CMP-01: Validate the Tailwind and Vuetify Styling Contract

**Status:** Planned  
**Depends on:** DES-06, FE-01

## Objective

Prove the styling boundary on representative components before applying it across the UI library.

## Deliverables

- Representative `VBtn`, `VTextField`, and LanguageSwitcher implementations.
- Tailwind classes applied to application markup and supported component roots.
- Vuetify theme, defaults, and public customization APIs used for component internals.
- One documented example of an internal override if the public APIs cannot express a required design.
- CSS output and specificity inspection for the representative components.
- Decision record for CSS layer order, class prefixing, and override policy.

## Acceptance criteria

- Tailwind and Vuetify work together without a global `important` flag.
- No override depends on an undocumented internal selector when a public API exists.
- Used Tailwind classes are statically detectable and are not assembled from partial strings.
- The production CSS contains only expected Tailwind utilities and required Vuetify styles.
- The chosen contract works with Nuxt SSR and both themes.

