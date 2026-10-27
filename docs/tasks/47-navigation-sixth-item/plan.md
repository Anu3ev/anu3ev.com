# 47 — Scrollable phone menu

Status: doing · Size: M · Milestone: [M5 — Recommendations](../../roadmap/README.md#m5--recommendations) · Mockups: rows "Phone menu with a 6th section" and "Phone menu, round 2" on the [design canvas](https://claude.ai/artifact/RmPeTJMZCzdYe4eUu9s6s7)

## Decision

On 27 October 2026 the owner chose **N5** and the **full word** for the label. The owner also reported that the phone menu has too much space under it in production. That fix is part of this task.

Scope: the scrolling bar with the arrow segment and the bottom-space fix, with today's five items. With five items everything fits, so nothing scrolls and the segment stays hidden. Task 48 adds the sixth item. From seven items on, the segment also shows the hidden count (N7).

## Space under the menu

The bar's bottom padding is `12px + env(safe-area-inset-bottom)`. On an iPhone with a home indicator the inset is 34 px, so the tabs end 46 px above the screen edge. Native iOS tab bars keep only the inset. The bottom padding becomes `max(8px, env(safe-area-inset-bottom))`: 34 px on such iPhones, 8 px on phones without an inset. That matches the 8 px top padding. The page's bottom padding and `scroll-padding-bottom` follow the new bar height.

## Problem

On phones the sidebar becomes a bottom bar of five equal tabs (`.primary-nav`, `grid-template-columns: repeat(5, …)` in `app/assets/css/main.css`), each with an icon above a 10px label. A sixth section does not fit. "Recommendations" (about 103 px at 10px) and «Рекомендации» (about 88 px) are also longer than a 64–70 px tab. The design should also survive a seventh or eighth section without being redone.

Platform guidance: Material 3 and Apple's HIG both cap a bottom bar at five destinations. More than that goes into a drawer or a "More" list. A horizontally scrolling bottom bar is not a standard pattern, so it must show clearly that it scrolls.

## Options

| Option | How it works | Long label | Grows to 7–8 | Owner feedback |
| --- | --- | --- | --- | --- |
| N1 | Fixed 76 px tabs; four fit and the fifth sticks out by half | Squeezed | Yes | The idea behind round 2 |
| N2 | N1 plus an edge fade and a small round arrow | Squeezed | Yes | Liked; the arrow is too small |
| N3 | Six icon tabs; only the active one shows its label | Fits | No: about seven icons at most | Looks good, but does not scale |
| N4 | About opens a sub-menu with About me, Recommendations and Certificates | Fits | Partly | — |
| **N5** | Tabs as wide as their labels; four fit and the fifth sticks out by half. The arrow is a full-height segment behind a divider ("\| ›") that slides to the end and then flips to "‹" | Fits as a wider tab | Yes | Round 2 |
| N6 | Four fixed tabs and a full-height "\| Menu" segment that opens a panel with every section | Fits in the panel | Yes, one row per section | Round 2 |
| N7 | N5 with eight sections; the segment shows how many tabs are hidden ("+4") and moves one screen per tap | Fits | Shows it | Round 2 (growth test of N5) |

**Chosen:** N5, plus N7's "+N" count once the menu has seven or more items. Reasons:
- It keeps the owner's swipe idea and fixes the small arrow.
- It keeps the true word.
- Adding sections later changes nothing in the design.

N6 is the most standard fallback if a scrolling bar tests poorly on a real phone.

## Label

Compared at real size on the canvas (board L):

| Label | Verdict |
| --- | --- |
| Recommendations / Рекомендации | **Chosen**: exact, LinkedIn's own term; fits once tabs size to their labels |
| Reviews | Vague: reads as code reviews or product ratings |
| References | Misleading: in hiring it means people a recruiter may call |
| Testimonials | Sales tone, nearly as long |
| Отзывы | Good Russian short form if the tabs stay equal width |

## Requirements

- Order on phones once task 48 adds the item: Home, About, Blog, Portfolio, Recommendations, Contacts. The desktop sidebar gets the same six items and has room for them.
- The scroll area is a real `overflow-x: auto` container with scroll snapping and a hidden scrollbar. Swipe, trackpad and keyboard all work.
- On load, and on every navigation, the active tab is scrolled into view, so it is never hidden behind the edge.
- The arrow segment is a `button` with an `aria-label` ("Show more sections" / "Show the first sections"). It is at least 44×52 px and hidden when everything fits. The fade marks the side that has more tabs.
- Tabs stay links inside `nav`. Focus moves through them in order and scrolls each one into view.
- Motion respects `prefers-reduced-motion`.
- New sizes use the spacing tokens. Any geometry exception (segment width, fade width) is added to `tests/unit/spacing.test.ts` with a reason.

## Tests

- E2e at 360, 390 and 402 px in EN and RU:
  - with five items, all tabs are visible and the segment is hidden;
  - the bar's bottom padding is 8 px when there is no safe-area inset;
  - at 320 px five tabs no longer fit (task 48 adds the same case with six items at every width): the last tab is partly visible, the arrow reveals it and flips, and the active tab is visible;
  - there's no horizontal page scroll;
  - axe passes.
- The existing navigation tests keep passing with six links.

## Done when

The bar works on a real phone in both languages with no extra space under it. Verify on production at phone width.
