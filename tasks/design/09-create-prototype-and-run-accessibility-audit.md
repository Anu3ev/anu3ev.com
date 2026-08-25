# DES-09: Create the Prototype and Run the Accessibility Audit

**Status:** In review
**Depends on:** DES-08

**Revision result:** The static prototype contains the revised journeys, full locale pairs, theme controls, and internal component states. HTML validation, axe/Pa11y, 54 responsive page-width checks, keyboard checks, reduced motion, image loading, and 30% localization expansion now pass. Alexander's visual and editorial review remains.

## Objective

Verify important journeys, interaction feedback, responsive behaviour, and WCAG 2.2 AA design requirements before development handoff.

## Deliverables

- Prototype for Home → Case Study → Contact and Article → Related Work journeys.
- Mobile navigation, theme switching, language switching, and contact-form flows.
- Accessibility audit covering contrast, focus, keyboard order, target size, labels, errors, and reduced motion.
- Heuristic UX review covering status visibility, consistency, error prevention, recognition, and content clarity.
- Four-way visual review: EN dark, EN light, RU dark, and RU light.
- Recorded findings and targeted corrections.

## Acceptance criteria

- All primary flows are understandable without design annotations.
- Interactive states are visually distinct without relying only on colour.
- Touch targets are at least 44×44 px where practical.
- Motion can be removed without losing meaning or access.
- All high-impact audit findings are corrected before handoff.
