# All topics review

Rechecked the owner's report on the current master build before changing code. In the DOM and on screen (1440, 1133 and 402 px), Home → Blog, Product UX → All topics, a direct `?topic=` URL → All topics and article → Back all listed the three published categories. The reproducible defect was search: the field promises "Search by title or topic…", yet `BlogListing` only matched title, description and tags. Typing **Product UX** under All topics returned zero articles, because that label appears only as the category.

`BlogListing` owns the filter, so the correction stays there: the category label joins the searchable text. Content tags, the fetch query, URL state and pagination are unchanged. Category buttons keep exact matching; search remains a case-insensitive substring match in the active locale.

## Regression

The isolated SSG fixture now spreads its 12 articles over three categories per locale (`Vue.js`, `Architecture`, `Product UX` and the Russian equivalents). The category names do not occur in fixture titles, descriptions or tags, so the search check proves the category itself is matched and stays independent of future production content.

`tests/e2e/blog-topics.spec.ts` runs in English and Russian: Home → Blog shows 12 results, a topic narrows to 4, All topics restores 12 and removes `topic` from the URL, typing the topic name character by character finds its 4 articles, reload keeps the query and clearing it restores 12.

Before the fix both locale tests failed exactly at the category search (expected 4, received 0); every earlier step passed. After the one-line fix both passed together with the existing pagination test.

## Verification

- `pnpm check`: content, ESLint, types and **51 unit tests** passed.
- `pnpm build` passed; the complete browser/axe suite passed **58 tests, zero skipped/flaky**, one worker. [Report](reports/browser.json).
- [Fallow](reports/fallow.json) passed with no introduced findings. Its single clone group (topic-filter markup in `BlogListing` and the portfolio page) is inherited and outside this task.

This was author self-review. It does not include an independent reviewer.
