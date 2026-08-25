# Design Package

The local design revision is validated and ready for editorial review. It is not `handoff-ready` until Alexander approves the English copy, the Russian adaptation, the selected recommendation excerpts, and the final image set. The prototype is the visual review source; `tokens.json` and the handoff documents describe the current implementation candidate.

## Review the result

- Open [English home](prototype/index.html) for the dark default theme.
- Open [English home, light theme](prototype/index.html#theme-toggle).
- Open [Russian home](prototype/ru.html) and use its navigation to review the complete Russian route set.
- Open [design-system and state board](prototype/states.html).
- Browse Work, Case Study, Writing, Article, About, Contact, Privacy, and 404 in English and Russian from the prototype navigation or the [handoff route table](handoff.md#prototype-pages).
- Compare captured review renders in [review](review/).

The pages are static HTML and CSS, so they can be opened directly without installing dependencies or running a server. The theme control, locale links, navigation, form states, and responsive layouts are intentionally usable without JavaScript.

## Package map

- [Information architecture](information-architecture.md): sitemap, journeys, page priorities, and bilingual route contract.
- [Design system](design-system.md): visual direction, typography, token roles, components, and Vuetify/Tailwind mapping.
- [Design tokens](tokens.json): machine-readable primitive and semantic values.
- [Content deck](content-deck.md): real homepage and case-study copy used by the design.
- [Accessibility and UX audit](accessibility-and-ux-audit.md): standards, contrast results, interaction review, and corrections.
- [Design quality audit](design-quality-audit.md): content evidence, media provenance, the design roast, and the revision boundary.
- [Handoff](handoff.md): responsive behavior, component contracts, assets, and implementation notes.
- [Figma state](figma-state.json): resumable IDs and the exact synchronization boundary.

## Figma status

The project file is [anu3ev.com - Website & Design System](https://www.figma.com/design/ZVGtT8KoFQL1ixcZqhzGIm). It contains the created variable collections and primitive/semantic color foundation.

Figma Starter imposed both a one-mode-per-collection restriction and an MCP call quota during the run. A discovery retry on 2026-08-25 failed before any mutation: metadata and library calls both returned the Starter tool-call limit, and `whoami` confirmed the correct account with a `View` seat on the `starter` plan. The remaining pages, components, and screens therefore could not be synchronized into Figma. Their complete, reviewable source is this package; [ADR 0006](../decisions/0006-use-local-design-package-when-figma-starter-blocks-sync.md) records the reversible continuation path.
