# 47 — Scrollable phone menu

The owner chose N5 for the phone menu and reported too much space under it in production. This task fixes the space and turns the bar into a strip that can scroll, with today's five items. Task 48 adds the sixth item. Plan and options: [plan.md](plan.md).

## Space under the menu

- The bar had `min-height: 76px` and 12 px of bottom padding plus the safe-area inset. On an iPhone with a home indicator that put about 46 px under the tabs.
- The bottom padding is now `max(8px, env(safe-area-inset-bottom))`:
  - 8 px on phones without an inset, the same as above the tabs;
  - only the system inset on iPhones (34 px), as native tab bars do.
- The fixed `min-height` is gone. The phone rule sets `min-height: 0`, because the desktop sidebar's `min-height: 660px` would otherwise apply.
- The bar is now 72 px without an inset: 8 + 55 + 8 px plus the border. The tabs are 55 px tall, not the 52 px the plan assumed; they already were before this task.

## The strip

- `SiteHeader.vue` wraps the links in `.nav-tabs`. On phones it is the single horizontal scroll container. On wider screens it is the same vertical list as before.
- Tabs use `flex: 1 0 64px`. While they fit, they share the width equally, so the bar looks the same as before at 360 px and up. When they don't fit, each keeps its label width and the strip scrolls, with snapping and a hidden scrollbar.
- **Arrow segment.** A real `button` behind a 1 px divider, 48 px wide and as tall as the tabs. It appears only when tabs are hidden.
  - Tapping it moves one strip width forward. The slide stops 40 px short, so a half-hidden tab ends up fully visible.
  - At the end the arrow flips and returns to the first tab.
  - Its `aria-label` and `title` follow the direction: "Show more sections" / "Back to the first sections", and «Показать остальные разделы» / «Вернуться к первым разделам» in Russian.
- **Fade.** A 40 px mask fades whichever side has hidden tabs. A mask on the scroll container stays in place while the tabs move, so no extra wrapper is needed.
- **Active tab.** It is scrolled into view after every navigation and whenever the strip or a tab changes size. The second case matters: the arrow appearing narrows the strip and could push the active tab out again. A first version measured only once on mount and failed the e2e test on `/contact` for exactly this reason.
- **Keyboard and motion.** Focus moves through the tabs in order, and the browser scrolls each focused tab into view. The scroll container clips anything outside it, so the focus ring is drawn inside the tabs and the arrow. Smooth scrolling is on only without `prefers-reduced-motion`.
- The state lives in the component. It is UI-only, has one user and a short lifecycle (one `ResizeObserver` and a scroll listener), so a composable would add a layer without an owner.

## Not done yet

- **The "+N" hidden-tab count from N7.** It only makes sense from seven items on. It will be added when there are that many.
- **The sixth item** (task 48).

## Tests

- **E2e** (`navigation.spec.ts`):
  - at 360 px all five tabs are visible, the arrow is hidden and the bottom padding is 8 px;
  - at 320 px five tabs don't fit: Contacts is cut off, the arrow reveals it and flips, and the second tap returns to Home with no horizontal page scroll;
  - on `/contact` and `/ru/contact` the active tab is in view.
- `responsive.spec.ts` now expects a 72 px bar.
- The existing 320 px keyboard test still passes with the scrolling strip.
- **Run locally with Node 24.15.0:** `pnpm check` (content, lint, types, 62 unit tests including the spacing standard), `pnpm build`, and all 113 e2e tests against the build served on port 4180.
- Screenshots at 390 px, at 320 px before and after the slide, and on the Russian contact page were checked by eye.

**Limits.**
- GitHub Actions could not start any job on this PR because of the account's billing status, so CI did not run. The local runs above stand in for it.
- The iPhone safe-area value can't be emulated in headless Chromium. The 34 px case still needs a look on a real iPhone after deployment.
