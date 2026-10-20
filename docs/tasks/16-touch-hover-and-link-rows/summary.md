# 16 — Touch hover and contact link rows

Version **1.0.11** fixes the bottom navigation on phones: a tapped item kept a stuck hover that replaced the blue active highlight with grey. Hover styles now apply only to devices that can hover, and the current page's highlight also survives a desktop pointer. The Contacts "Find me elsewhere" rows were reworked from task 14: they now span the column like the site's other list rows, with the text aligned to the heading and the hover filling the row.

Both navigation checks failed on 1.0.10 and pass now. Validation passed: content/lint/types, **51 unit tests**, static export, **63 browser/axe checks** and Fallow. [Review and evidence](review.md). The blog topic report could not be reproduced and is pending details from the owner. Next: the custom domain.
