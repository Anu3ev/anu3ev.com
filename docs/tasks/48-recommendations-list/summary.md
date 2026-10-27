# 48 — Recommendations list

The Recommendations section is now public. It has a list page, a sixth item in the sidebar and the phone menu, and the single pages link back to the list. Release 1.6.0. Plan: [plan.md](plan.md).

## The list (R1)

`/recommendations/` and `/ru/recommendations/`:
- the Recommendations eyebrow;
- the H1 "People I worked with" / «Люди, с которыми я работал»;
- one line on who wrote the texts and that each is shown in full with a link to the original.

One card per recommendation, newest first. Each card has initials, name, role and month, the highlight sentence (with `lang="en"`), and "Read it ↗" / «Читать целиком». The name is the heading link, like the case cards.

**Differences from R1:**
- **The H1 has no count.** "8 people I worked with" would need Russian plural forms in the title and an edit whenever a ninth person writes.
- **Cards show "Mentions 2 cases" instead of case names.** Case titles are full sentences and would wrap over three lines on a phone; the single page lists them. The count uses `Intl.PluralRules`, so Russian reads «2 кейса», «4 кейса», «1 кейс».

## Navigation

- The menu is now Home, About, Blog, Portfolio, Recommendations, Contacts, with a quote-mark icon.
- On phones the strip from task 47 now scrolls at every width. Four tabs and part of "Recommendations" show, and the arrow segment is visible.
- On a recommendation page the item is marked active, and the strip scrolls it into view.
- The single pages' back link is now "All recommendations" / «Все рекомендации», and their breadcrumb parent is the list.
- **Structured data and GEO:**
  - the list is a `CollectionPage` with an `ItemList` of the pages;
  - it is in the sitemap;
  - `llms.txt` lists it under Pages.

## Fix to task 46

The field `excerpt` was renamed to `highlight`. Nuxt Content fills its own `excerpt` from the Markdown body and overwrote ours. That left every single page's meta description as "Recommendations" in production and the list cards empty in the first build of this task. The e2e suite now checks the meta description and the card text, so a silently overwritten field fails the build.

## Tests

- **E2e** (`recommendations.spec.ts`):
  - the list in both languages, newest first, with each card's name, highlight and link;
  - every page's meta description;
  - the menu item current on the list and active on a single page;
  - the back link to the list.
- **Navigation:**
  - at 390 px four tabs are fully shown and "Recommendations" sticks out by more than 20 px;
  - six links in the menu at every reference frame;
  - the list page is in the responsive and accessibility runs.
- **Run locally with Node 24.15.0:** `pnpm check` (68 unit tests), `pnpm build`, and all 127 e2e tests against the build.
- Phone screenshots in both languages were checked by eye.

**Limits.**
- GitHub Actions can't start jobs because of the account's billing status.
- **Held for the owner before merging:** the eight recommenders get a short heads-up first.
