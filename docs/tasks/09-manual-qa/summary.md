# Manual testing and functional fixes

Patch **1.0.4** fixes the reported search focus and three problems found in the browser: lost letters during typing, a portfolio filter reset after Back, and case contents navigation placed after the text.

The production follow-up **1.0.5** also prevents interaction with client-only controls before hydration. [Cause, fix and delayed-script tests](hydration.md). The current complete suite has **52 passing browser tests** and 43 passing unit tests.

I repeated the corrected pointer/keyboard flows in English/Russian and both themes. Content/lint/types, 43 unit tests, the static build and all **50 browser tests** passed. A separate 28-route crawl at 320 px found no overflow, broken same-page targets or uncaught page errors. Fallow core findings are zero; its CSS/diff-risk warning limits are documented.

[Findings, screenshots and exact scope](review.md) · [browser results](reports/browser.json) · [route crawl](reports/route-crawl.json) · [plan](plan.md).

The next tasks, in the user's requested order, are English repository documentation, design corrections against the actual MagicPath mobile/tablet/browser frames, and finally connecting anu3ev.com through Zomro. The current mobile menu's functionality was tested; it is not accepted as matching the supplied bottom-navigation design. Production publication is handled by the existing Git integration after merge.
