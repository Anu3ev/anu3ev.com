# 11 — Responsive layout aligned with MagicPath

Version **1.0.7** replaces the extra mobile header with the reference's fixed four-link bottom navigation. Corrected the shared shell, cover/avatar, typography, spacing, sidebars, Blog cards, Portfolio facts and Contacts cards. Portfolio/Contacts use the Home/Blog blue palette. Actual published content, images, filtering, locales and theme controls remain functional.

Inspected all four references at the three supplied sizes and saved twelve reference/result screenshots with measurements. Home's measured key rectangles match at all three frames. The Portfolio facts are editable through CMS. [Review, corrections and intentional content differences](review.md).

Final validation passed: content/lint/types, **43 unit tests**, static export, **55 browser/axe checks**, twelve frame requests and the configured Fallow gate. No skipped/flaky browser tests. Manual light-theme search focus, keyboard navigation and Russian text-spacing checks passed. Field metrics and unsupported browser/screen-reader checks were not claimed.

PR 13 passed CI and merged at `4d07e44e5615b26e6cb811aaf64fa642777d61ff`. The public version endpoint confirmed 1.0.7 at that commit; the three viewport checks and mobile keyboard check passed against Vercel. Release v1.0.7 contains its uploaded 6,311,057-byte archive, SHA256 `dbd0714030fbf8350ea8386b38a9e28b9d53d3a156e3ad210cd27395fdada6dd`.

Next in order: external links, the reported All topics issue, then the required anu3ev.com connection.
