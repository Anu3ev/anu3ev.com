# 12 — External resources open in a new tab

Version **1.0.8** applies `_blank` and `noopener noreferrer` to external profile/contact, project and Markdown links. Internal navigation and email actions keep their context; same-site project playgrounds are supported. Privacy now uses the CMS profile email.

Validation passed: content/lint/types, **51 unit tests**, static export, the final **56 browser/axe checks** and Fallow. The browser regression covers all 28 public routes and popup isolation. A separate real GitHub click confirmed the new tab, preserved Contacts and null opener. [Review and exact evidence](review.md).

The preceding design version 1.0.7 was automatically published at `4d07e44e5615b26e6cb811aaf64fa642777d61ff`; all four focused public design/navigation checks passed. Its new external-link check failed as expected before this correction. Next: All topics, then the required custom domain.
