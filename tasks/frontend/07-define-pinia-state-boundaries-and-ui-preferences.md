# FE-07: Define Pinia State Boundaries and UI Preferences

**Status:** Planned  
**Depends on:** FE-01, CMP-03, CMP-04

## Objective

Use Pinia only for confirmed shared client state while keeping locale, route, content, and Vuetify-owned theme state with their proper owners.

## Deliverables

- Written state ownership table covering persisted, derived, and transient state.
- Pinia stores only for cross-page state that cannot be owned cleanly by Nuxt, Vuetify, or Nuxt i18n.
- Persistence rules for approved user preferences.
- SSR-safe store initialization and hydration.
- Tests for creation, update, navigation, reload, and reset behaviour.

## Acceptance criteria

- No store duplicates the current locale, route, server content, or Vuetify theme object.
- Persisted values are part of the product contract rather than transient component state.
- SSR and client hydration produce the same initial displayed values.
- Store APIs use domain names and have at least two meaningful contract assertions in each test case.
- If no additional shared state is justified, the task records that conclusion instead of creating an empty store.

