# 50 — Mentions on case pages

Status: todo · Size: S · Milestone: [M5 — Recommendations](../../roadmap/README.md#m5--recommendations) · Depends on: [46](../46-recommendation-pages/plan.md) · Mockup: R4 in the design mockups

## Goal

On a case that colleagues mention, show what one of them said right next to the results it backs up.

## The block (R4)

- Place: directly under the case's result tiles, between two hairlines. It is not a card, so it doesn't compete with the results.
- One sentence: the `quote` from the first recommendation (by `featured`, then date) whose `mentions` include this case. It is set in the body colour at reading size. On the Russian page it carries `lang="en"`.
- Below it, overlapping initials for everyone who mentions the case, and the line "Mentioned in 3 recommendations: Egor, Andrey, Dmitry". Each name links to that person's recommendation page. For one person the line reads "From Egor Fedkin's recommendation".
- Cases with no mentions show nothing.
- The block is computed from `mentions`, so there is no new field on cases.

## Tests

- Unit: the lookup from a case slug to its mentions is sorted correctly, and it ignores unpublished recommendations.
- E2e:
  - the product image editor and abandoned carts cases show the block in EN and RU;
  - a case without mentions doesn't;
  - every name link resolves;
  - axe passes.

## Done when

Every case named in a recommendation shows the block, and the quoted sentence matches LinkedIn word for word.
