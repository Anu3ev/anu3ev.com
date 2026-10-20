# 17 — Home cover and article images

Version **1.0.12** applies three owner corrections from 1.0.11 screenshots.

- **Cover text.** In the MagicPath reference and in 1.0.11 the decorative shapes ran over "Crafting the interactive web" and, on mobile, cut off `<ideas /> → interfaces`. The owner did not want the picture to cover text, so this deliberately departs from the reference: the shapes start to the right of the label, the code line moves to the bottom left beside the avatar, and both lines sit on a layer above the shapes. Mobile uses narrower shapes so three still show.
- **Let's talk.** The button touched (desktop) or overlapped by 3px (mobile) the bottom edge of the cover. It now sits 14px below it at every reference width.
- **Article images.** Only the first blog preview showed its cover image. Every preview now shows it.

A new check per reference frame hit-tests the rotated shapes against both text lines (with their painted ring) and requires the gap below the cover; it failed at all three widths on 1.0.11. The pagination fixture now requires an image on all 10 cards of a page.

Validation: `pnpm check` (content, ESLint, types, **51 unit tests**), `pnpm build`, **66 browser/axe checks** (zero skipped/flaky, [report](reports/browser.json)) and [Fallow](reports/fallow.json) pass. Fallow's single clone group is the inherited topic-filter markup; its 16 "styling introduced" items are advisory raw-value notes counted because `main.css` changed, not new findings in this diff. Screenshots after the change: [1440](screenshots/cover-1440.png), [402](screenshots/cover-402.png). This was author self-review. Next: the custom domain switch.
