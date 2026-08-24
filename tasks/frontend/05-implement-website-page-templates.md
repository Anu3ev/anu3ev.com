# FE-05: Implement Website Page Templates

**Status:** Planned  
**Depends on:** DES-08, FE-03, FE-04, CMP-03, CMP-05

## Objective

Build all approved page templates from reusable components and localized content without duplicating page-specific layout logic.

## Deliverables

- Home, Work index, Case Study, Writing index, Article, About, Contact, Privacy, and 404 pages.
- Responsive layouts matching documented mobile, tablet, and desktop behaviour.
- Related-project and related-article navigation.
- Missing optional media fallbacks.
- Localized dates, reading time, labels, and metadata display.

## Acceptance criteria

- All pages work in EN/RU and dark/light combinations.
- Layouts remain usable from 320 px without horizontal overflow.
- Long titles and 30% text expansion do not require locale-specific CSS patches.
- Page templates compose domain components instead of copying their internal markup.
- Direct route loads and client transitions show the same final state.

