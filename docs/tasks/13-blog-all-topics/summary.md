# 13 — All topics and category search

Version **1.0.9** makes blog search match the article category, as its "title or topic" placeholder promises. Previously, searching **Product UX** under All topics found nothing although the category had an article; topic buttons and the All topics reset already worked.

The isolated SSG fixture now has three categories per locale, and a new English/Russian browser regression covers Home → Blog, topic selection and reset, typed category search, reload and clearing. It failed before the fix and passes after it.

Validation passed: content/lint/types, **51 unit tests**, static export, **58 browser/axe checks** and Fallow. [Review and exact evidence](review.md). Next: link-block spacing, then the custom domain.
