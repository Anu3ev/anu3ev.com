# 49 — Teaser on About

Status: todo · Size: S · Milestone: [M5 — Recommendations](../../roadmap/README.md#m5--recommendations) · Depends on: [46](../46-recommendation-pages/plan.md), [48](../48-recommendations-list/plan.md) · Mockup: R3 on the [design canvas](https://claude.ai/artifact/RmPeTJMZCzdYe4eUu9s6s7)

## Goal

A short block on About, so a reader who never opens the section still sees what colleagues say.

## The block (R3)

- Place: after the experience section, before Certificates.
- Eyebrow "Recommendations" and an H2 "What colleagues say" / its Russian version.
- Three cards, sorted by `featured`. Each card shows:
  - the `highlight`;
  - initials, name and relationship;
  - an arrow.
  The whole card links to that recommendation's page.
- Below the cards, a full-width row "Read all 8 recommendations →". The number comes from the published count, not from copy.
- The proposed three are Egor Fedkin (direct manager), Andrey Stikheev (CTO and co-founder) and Dmitry Sadovsky (senior engineer). The owner can change them through `featured` in the CMS.
- When nothing is featured, the block is hidden.

## Tests

- E2e:
  - About shows three cards in `featured` order in EN and RU;
  - each card opens its page;
  - "Read all" opens the list and shows the real count;
  - the outline (contents) gains the new section;
  - axe passes.
- Unit: no more than three items are featured, and the `featured` positions are unique.

## Done when

The block is live in both languages and matches R3 at phone width.
