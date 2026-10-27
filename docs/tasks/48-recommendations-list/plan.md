# 48 — Recommendations list

Status: todo · Size: S · Milestone: [M5 — Recommendations](../../roadmap/README.md#m5--recommendations) · Depends on: [46](../46-recommendation-pages/plan.md), [47](../47-navigation-sixth-item/plan.md) · Mockup: R1 in the design mockups

## Goal

The section's front page at `/recommendations` and `/ru/recommendations`. This task makes the section public and releases 1.6.0.

## The page (R1)

- Eyebrow "Recommendations" and an H1 with the count ("8 people I worked with" / its Russian version). Below them, one line naming the recommenders' roles at inSales and the English coach, and saying that each recommendation links to its original. Run the copy through `anti-cringe-copy`.
- One card per recommendation, newest first:
  - initials, name, `headline` and date;
  - the `excerpt`;
  - the cases from `mentions`, as short titles;
  - "Read it →" to the task 46 page. The whole card is a single link target, to match the case cards.
- Page header text: "What colleagues say" / its Russian version.

## Wiring

- The sixth navigation item from task 47 points here.
- The "← All recommendations" back link on the task 46 pages switches from About to this page.
- `usePageSeo`, a `CollectionPage` JSON-LD with an `ItemList` of the pages, and an entry in the sitemap and `llms.txt`.
- `package.json` → 1.6.0. The release notes cover tasks 46–48.

## Before release

Alexander sends the eight recommenders a short heads-up. This is an owner action. Mark it in the PR description.

## Tests

- E2e:
  - the list shows every published recommendation in date order in EN and RU;
  - every card opens its page;
  - the navigation item is active on the list and on single pages;
  - there's no horizontal scroll at 360 px;
  - axe passes.

## Done when

The section is reachable from every page on desktop and phone, and production shows 1.6.0.
