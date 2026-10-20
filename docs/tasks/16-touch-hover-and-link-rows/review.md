# Touch hover and link rows review

## Reproduction

A mobile-emulated walk on public 1.0.10 (402×874, touch, `hover: none`) tapped Home, Blog, Portfolio, Contacts, Blog and Home. Routing, `aria-current` and scroll reset were correct each time, but the current item rendered `rgb(24, 26, 31)` (`--surface`, the hover colour) instead of `rgb(32, 44, 69)` (`--soft-accent`) whenever the tapped link kept `:hover`. On desktop, hovering the active Blog item produced the same grey. Both new browser checks failed on 1.0.10 with exactly that received colour; under the fix they pass.

The touch test leaves the pointer on each tapped item, which is the state a stuck tap hover produces. Without it the check was timing-dependent: the stale hover cleared inside Playwright's assertion window, so the first draft passed on the broken build and was rejected as evidence.

The blog topic report could not be reproduced: in the owner's Chrome and in the emulated phone, All topics lists all three published articles and every topic button is on screen. It remains open with the owner for the exact steps.

## Change

- `main.css`: eleven hover rules are wrapped in `@media (hover: hover)`; the active navigation selectors are `.primary-nav a.nav-active, .primary-nav a.nav-exact`.
- Contacts rows: `padding: 24px 28px` (20px on mobile) on the link, background on hover, `outline-offset: -3px` for focus; the `::before` surface is removed.
- `responsive.spec.ts`: the row check now requires the row to span the column's inner edges, its text to align with the heading and to sit at least 20px inside the row; plus the touch and desktop navigation checks.

## Verification

- Screenshots: [hover, dark, 1440](screenshots/r-hover-dark-1440.png), [focus, light, 402](screenshots/r-focus-light-402.png), [bottom navigation after six taps](screenshots/taps-after.png).
- `pnpm check`: content, ESLint, types and **51 unit tests** passed. `pnpm build` passed; the full browser/axe suite passed **63 tests, zero skipped/flaky**, one worker. [Report](reports/browser.json).
- [Fallow](reports/fallow.json) passed with no findings.

This was author self-review. Emulated touch is not a physical phone; real-device confirmation is with the owner.
