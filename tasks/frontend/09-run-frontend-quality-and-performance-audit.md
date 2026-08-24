# FE-09: Run the Frontend Quality and Performance Audit

**Status:** Planned  
**Depends on:** FE-05, FE-06, FE-07, FE-08, CMP-07

## Objective

Verify responsive behaviour, accessibility, localization, rendering, bundle output, and user-visible performance before deployment.

## Deliverables

- Focused unit, component, and end-to-end test suites.
- Automated accessibility checks plus keyboard and screen-reader spot checks.
- Responsive checks at 320, 390, 768, 1024, 1280, and 1536 px.
- EN/RU and dark/light visual regression coverage.
- Bundle and generated-CSS inspection for unused or unexpectedly large assets.
- Core Web Vitals and page-weight report for representative routes.

## Acceptance criteria

- Type check, lint, tests, and production build complete without warnings.
- No critical or serious automated accessibility findings remain.
- Primary content is available in server-rendered HTML.
- Tailwind output contains only expected used utilities and explicit inclusions.
- Representative pages meet agreed performance budgets on mobile conditions.
- Failures are fixed at the responsible contract rather than hidden by test exceptions.
