# DES-04: Define the Visual Direction and Design Tokens

**Status:** Planned  
**Depends on:** DES-03

## Objective

Create the editorial engineering visual identity and the semantic token foundation for complete dark and light themes.

## Deliverables

- Reference board explaining accepted and rejected visual patterns.
- Primitive warm-neutral, copper-orange, and status colour scales.
- Semantic colour variables for canvas, surfaces, text, borders, brand, focus, and status roles.
- Spacing, sizing, radius, border, elevation, grid, and motion scales.
- Dark and light variable modes using aliases rather than duplicated raw values.
- CSS variable syntax for every production-facing token.
- Contrast report for all meaningful colour pairs.

## Acceptance criteria

- Dark mode is comfortable rather than pure-black or high-saturation.
- Light mode is designed independently and is not a mechanical inversion.
- Normal text reaches 4.5:1 contrast and large text or non-text controls reach 3:1.
- Components can be built without hardcoded colour, spacing, radius, or shadow values.
- The visual direction avoids glow-heavy, gradient-heavy, and generic AI-portfolio styling.

