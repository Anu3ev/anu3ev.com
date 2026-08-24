# FE-01: Scaffold the Nuxt TypeScript Application

**Status:** Planned  
**Depends on:** None

## Objective

Create a warning-free Nuxt 4 foundation for browser and server development without adding premature application abstractions.

## Deliverables

- Nuxt 4 application configured for strict TypeScript.
- Tailwind CSS, Vuetify, Nuxt i18n, Nuxt Content, and Pinia dependencies.
- SSR-enabled application entry, layouts, assets, public files, and server directories.
- Linting, formatting, type checking, unit testing, and build scripts.
- Environment-variable typing and validation entry point.
- Minimal contributor documentation for local development.

## Acceptance criteria

- Development, type-check, test, lint, and production-build commands complete without warnings.
- Browser and server TypeScript use strict settings appropriate to their runtime.
- No example components, demo pages, or generated placeholder styles remain.
- Pinia is available but no store is created without an owned state contract.
- The initial page renders through SSR without hydration errors.

