# 18 — Article previews at the article cover size

Blog previews cropped each cover to a 3.6:1 strip (2.2:1 on mobile) with a 1px border, while the article page shows the same image at its native 1200×630. The preview now uses the article's frame: `aspect-ratio: 1200 / 630`, centred `object-fit: cover`, no border, and no mobile override, so a card and its article show the same picture at the same size.

A browser check per reference frame opens the first card's article and compares the preview and cover boxes (±1px). It failed on production 1.0.14 at all three widths and passes now. Validation: `pnpm check` (51 unit tests), `pnpm build`, **69 browser/axe checks** ([report](reports/browser.json)).
