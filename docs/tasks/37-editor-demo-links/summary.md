# 37 — Direct demo and code links from the product editor

From the external portfolio review: the product image editor's "Where to try it" section pointed only to the engine's case page, so trying the editor took two clicks.

The product editor itself runs inside inSales and needs an account, so it has no public demo. The case therefore keeps the inSales instructions and now links straight to the open-source engine's **live demo** and **source code on GitHub** (EN/RU), as well as its case page.

Buttons at the top of the product case were rejected: "Try the live demo" there would suggest a demo of the product itself.

**Test.** `case-links.spec.ts` checks that both language versions link to the engine's `demo` and `repository`, taken from the engine case's metadata, and open them in a new tab.
