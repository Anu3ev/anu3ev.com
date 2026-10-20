# All topics and category search

The owner reported missing non-Vue articles under All topics. On public 1.0.7, navigation from Home and Product UX → All topics returned all three published categories. A related exact failure was reproduced: searching **Product UX** under All topics returned zero articles, while selecting that category returned its published article. Its category label is absent from title/description/tags, which are the current search fields.

BlogListing owns this filter. Include the existing category metadata in its searchable text; do not change content tags, fetch limits or URL-state ownership. Keep All topics as the category reset and retain normal search semantics.

Extend the isolated real SSG fixture with three categories, then add English/Russian regressions for Home → Blog, topic selection/reset, exact category-name search, reload and clearing search. The fixture makes this independent of future production content edits. First run the new checks before the fix, then validate the minimal production change, full unit/browser/axe suite and changed-code audit.

After review/merge, the newly queued link-block spacing correction comes next. The custom domain remains the final task.
