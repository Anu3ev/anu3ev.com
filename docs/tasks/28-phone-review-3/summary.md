# 28 — Third phone review: small fixes

Fixes from the owner's third phone review (2026-10-21). The section list, the theme switch, the reading progress bar, LinkedIn skills, the About page entry on mobile and the spacing standard are separate tasks.

| # | Owner's point | Change |
|---|---|---|
| 1 | "AA / 01 · RU · theme" is not on one line | The counter used a 10 px monospace face beside 10 px text, so their centres differed. All three controls now use `line-height: 1` and close sizes. "AA" was a leftover of the old monogram, so the counter now reads "01 / 04": the section's place among the four navigation sections. |
| 3 | What does "↗" before "Remote · B2B / EOR" mean? | Nothing; it was decoration that looked like an external link. Location and remote work now have a pin and a globe icon. |
| 4 | iOS zooms into the search field | iOS Safari zooms into any focused field below 16 px. The field is 14 px with a mouse and 16 px on touch screens (`pointer: coarse`). |
| 5 | A blank strip below the bottom panel | Not reproducible in Chromium or the Playwright iPhone profile: the page ends at its last element. The viewport lacked `viewport-fit=cover`. Without it, iOS Safari keeps its own strip below fixed bottom bars, and `env(safe-area-inset-*)` is always 0. The viewport now covers the screen. The panel already pads by the bottom inset, and the layout and panel now also pad by the side insets for landscape. **Needs a check on a real iPhone.** |
| 6 | Empty space and a short line under the article | The line was the author block's top border, and the space was its 24 px bottom padding plus the page's 48 px. The author is now a framed card right after the tags, and the page padding is the only space after it. |
| 7 | Footer on mobile looks odd | Name and "Privacy" shared a row while the tagline wrapped below it, all at 9–10 px. On phones the footer is one left-aligned column: name, tagline, then the privacy link at full touch height. The text is now 11 px. |

**Tests.** New mobile e2e checks: the search field is 16 px on touch, the topbar controls share one centre line (±1 px), and the gap between the author card and the contact callout is at most 56 px.
