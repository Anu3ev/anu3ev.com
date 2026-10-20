# Link-block spacing review

[The owner's screenshot](screenshots/owner-report.png) shows the hovered Telegram row on Contacts: the surface begins at the text edge. `.contact-options` owns the 28px/20px gutter while each link had only block padding, so `a:hover { background }` painted a box exactly as wide as its content.

Changing the link's own inline padding would have moved the text and the dividers away from the heading alignment measured in task 11 and shown in the MagicPath Contacts reference. Instead, `.contact-options a::before` is an absolutely positioned surface with `inset: 0 -14px` and a 7px radius, behind the content in an isolated stacking context. Hover paints it with the existing `--surface` token; `:focus-visible` moves the existing 3px accent ring from the link box to the same surface (inset by its width so it is not clipped). The native link keeps focus and semantics, only the indicator's geometry changes. The surface ends at the row's padding box, so the divider below stays visible.

Related places were audited: primary navigation, `feed-more`, buttons and icon buttons already have inner padding; the right-column profile list changes only colour. No other link block needed a change.

## Regression

`tests/e2e/responsive.spec.ts` adds one check per reference frame (402×874, 1133×744, 1440×1024). It hovers the first Contacts row and computes the painted surface from the row box and resolved `::before` offsets: it must be painted, start at least 12px before the text and stay inside the main column. Against the previous CSS, all three failed (no surface was painted); the existing layout checks in the same file passed.

## Verification

- Resolved geometry: text stays at x=357 (1440) and x=20 (402), as before; the surface starts 14px earlier.
- [Hover](screenshots/hover-dark-1440.png) and [Tab focus](screenshots/focus-dark-1440.png) at 1440 in the dark theme, and [hover](screenshots/hover-light-402.png) and [focus](screenshots/focus-light-402.png) at 402 in the light theme: inner space on both sides, dividers intact, ring fully visible.
- `pnpm check`: content, ESLint, types and **51 unit tests** passed. `pnpm build` passed; the full browser/axe suite passed **61 tests, zero skipped/flaky**, one worker. [Report](reports/browser.json).
- [Fallow](reports/fallow.json) passed with no findings.

This was author self-review. Visual comparison covered the two frames above in both themes; the tablet frame was checked by the geometry test only.
