# 47 — Sixth item in the navigation

Status: design · Size: M · Milestone: [M5 — Recommendations](../../roadmap/README.md#m5--recommendations) · Mockups: rows "Phone menu with a 6th section" and "Phone menu, round 2" on the [design canvas](https://claude.ai/artifact/RmPeTJMZCzdYe4eUu9s6s7)

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

**Proposal:** N5, plus N7's "+N" count once the menu has seven or more items. Reasons:
- It keeps the owner's swipe idea and fixes the small arrow.
- It keeps the true word.
- Adding sections later changes nothing in the design.

N6 is the most standard fallback if a scrolling bar tests poorly on a real phone.

## Label

Compared at real size on the canvas (board L):

| Label | Verdict |
| --- | --- |
| Recommendations / Рекомендации | Keep: exact, LinkedIn's own term; fits once tabs size to their labels |
| Reviews | Vague: reads as code reviews or product ratings |
| References | Misleading: in hiring it means people a recruiter may call |
| Testimonials | Sales tone, nearly as long |
| Отзывы | Good Russian short form if the tabs stay equal width |

## Requirements once the design is chosen

- Order on phones: Home, About, Blog, Portfolio, Recommendations, Contacts. The desktop sidebar gets the same six items and has room for them.
- The scroll area is a real `overflow-x: auto` container with scroll snapping and a hidden scrollbar. Swipe, trackpad and keyboard all work.
- On load, and on every navigation, the active tab is scrolled into view, so it is never hidden behind the edge.
- The arrow segment is a `button` with an `aria-label` ("Show more sections" / "Show the first sections"). It is at least 44×52 px and hidden when everything fits. The fade marks the side that has more tabs.
- Tabs stay links inside `nav`. Focus moves through them in order and scrolls each one into view.
- Motion respects `prefers-reduced-motion`.
- New sizes use the spacing tokens. Any geometry exception (segment width, fade width) is added to `tests/unit/spacing.test.ts` with a reason.

## Tests

- E2e at 360, 390 and 402 px in EN and RU:
  - the fifth tab is partly visible;
  - the arrow reveals the last tab and flips;
  - the active tab is visible on `/recommendations` and `/contact`;
  - there's no horizontal page scroll;
  - axe passes.
- The existing navigation tests keep passing with six links.

## Done when

The owner has picked an option on the canvas and it works on a real phone in both languages. Verify on production at phone width.
