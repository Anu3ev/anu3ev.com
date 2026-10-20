# Manual QA and self-review

The initial 1.0.4 review below records 50 tests. The subsequent [production hydration follow-up](hydration.md) adds two delayed-script cases; patch 1.0.5 passes all 52 tests.

## Findings and fixes

| Finding | Evidence | Fix |
| --- | --- | --- |
| Search focus framed only the square text input and excluded its icon | Reproduced with click and Tab; [before](screenshots/search-focus-before.png) | One rounded `:focus-within` indicator on the complete field; native input keeps focus and its accessible name. [Dark](screenshots/search-focus-after-dark.png), [light](screenshots/search-focus-after-light.png), [RU mobile](screenshots/search-focus-after-ru-mobile.png). Browser autocomplete is disabled for this search. |
| Typing lost letters while URL updates overlapped | Manual `undo` became `u`; the new sequential-input test failed before the fix | Use Vue Router's client `replace` directly. Nuxt 4.6.2 `navigateTo` returns a destination while middleware is processing; an overlapping input event can enter that path. No separate draft, debounce or watcher is needed. |
| Portfolio category reset after opening a case and pressing Back | Manual Open source → case → Back showed all five projects; regression test failed | Persist the category in the URL, restore it after hydration, reject unknown categories, and mark filtered views noindex. The new test covers Back and direct reload. |
| Case contents navigation appeared after the entire case | [Original case](screenshots/case-en-light-desktop.png) | Move it before the text and use the localized “On this page” label. [Corrected mobile navigation](screenshots/case-toc-after-mobile.png). |

## Guided browser actions

The browser was operated interactively with pointer, Tab, Shift+Tab, Enter, Escape and native Back. I inspected the rendered screenshots and accessibility snapshots, rather than treating axe as a visual review.

- Home: English/Russian switch, skip link visibility and focus transfer to `main`, profile content and [mobile layout](screenshots/home-ru-mobile.png).
- Blog: topic selection, actual sequential typing, empty results, native Escape clearing, a complete English title, Cyrillic input, article navigation, Back, direct filtered reload and visible focus in both themes.
- Portfolio/case: category selection, case reading, source/demo destinations, all contents targets, a contents jump, locale preservation, Back and category restoration.
- Contact/About/Privacy: real destination URLs, email wrapping at 320 px ([Russian](screenshots/contact-ru-320.png), [English/light](screenshots/contact-en-light-320.png)), [portrait and career](screenshots/about-en-light-desktop.png), long copy, both themes and localized content. No messages were sent through contact links.
- Mobile navigation: open, Escape, focus return and selecting a destination. This checks its current functionality; its design is superseded by the separately requested MagicPath correction.
- Article: [English](screenshots/article-en-light-mobile.png)/Russian reading, images, author link and [text spacing](screenshots/article-ru-text-spacing.png) at 375 px (`line-height: 1.5`, letter spacing `.12em`, word spacing `.16em`, paragraph spacing `2em`). No horizontal overflow was observed.
- 404: Russian unknown URL returned 404, localized recovery link opened Russian Home. Expected missing-resource console entries on a real 404 are distinct from uncaught JavaScript exceptions.
- CMS: welcome screen, token dialog, initial input focus, disabled empty submission, Escape and focus return. No token was entered; authenticated publishing was not tested.

## Automated verification

`pnpm check` passed content validation, ESLint, TypeScript and all 43 unit tests. The production build passed. The complete browser suite passed **50/50**, with one worker, no failures, skips or flaky results. The existing search test now uses `pressSequentially`; one portfolio/history regression test was added. Both failures were demonstrated before their fixes.

The separate [scripted crawl](reports/route-crawl.json) checked all 28 published HTML routes at 320 px: HTTP 200, no horizontal overflow, no broken same-page targets, no failed completed images and no uncaught page errors. This crawl is not described as a manual visual inspection of every route. [Browser report](reports/browser.json).

[Fallow](reports/fallow-summary.json) exited 0 with a **warn** verdict: core dead code, cycles, boundaries, complexity and clones have no findings. CSS heuristics flag the deliberately scoped focus selectors, existing relative inline-code sizing, existing selectors and reduced-motion overrides. Several unchanged later CSS lines are classified as introduced after a line insertion. The audit also emits one diff-risk count without a detailed finding in its JSON envelope; no browser tests were skipped. Rule-pack policies are not configured, so zero policy findings do not claim that a policy audit ran.

## Review and remaining work

I reviewed the complete diff against the actual owners and callers: the search method, portfolio query state/SEO, contents renderer and both locale dictionaries. Functions stay small; no new dependency, generic filter abstraction, global state or hidden error suppression was added. The corrected paths were repeated manually after the automated checks. This is a self-review, not an independent review.

`code-writer` received bounded lessons about complete-field focus, sequential-input tests and SSR control readiness. The Obsidian source and installed copies were synchronized, both validators passed and the recursive diff was empty.

The user's design correction remains queued after English repository documentation: compare the actual MagicPath Mobile 402×874, Tablet 1133×744 and Browser 1440×1024 layouts, including the fixed mobile bottom navigation, dimensions and spacing. This task does **not** certify visual fidelity to those frames. Safari, Firefox, native browser zoom, IME and screen-reader testing were not performed. DNS setup and the owner's first authenticated CMS publish remain external setup limitations.
