# 27 — Mobile and card polish

Fixes from the owner's phone review of 1.1.1, plus one issue found in an own full-page sweep at 402 px.

| # | Owner's point | Change |
|---|---|---|
| 1 | Email icon squashed on mobile | The mobile override made it 30 × 34; it is now a 34 px square. |
| 2, 4 | Numbers sit at the top of the proof tiles; tile content not centred | On mobile the number and the label are vertically centred, and the number column has a fixed 84 px width so labels line up. |
| 3 | "Let's talk" looked detached from the avatar | The button shares the avatar's centre line again, so both straddle the cover edge as one row (owner's reference screenshots). The cover test now asserts that geometry instead of a gap. |
| 5, 6 | "Vue 3" chip duplicates the stack; the category sits where a name is expected | Card header reads like a post: **Alexander Anufriev**, then *inSales · period*, with the category as the chip. A new required `context` field ("inSales" / "Open source") holds where the work was done. The CMS Period field is now per language, because Russian pages spell out the months. |
| 7 | "Read case study" not aligned with the tags row | The card footer centres the link against the tags. |
| 8 | "On this page" block | A compact numbered outline (01, 02…), at least 32 px per row (WCAG 2.2 target size), in two columns on wider screens and one on phones. A sticky TOC that highlights the current section, the usual pattern for long reads, needs a side column, and here the right column holds the profile. The top bar is not sticky, so headings need no scroll offset. |
| — | Own sweep | The About page "Tools I work with" heading had no top spacing: its Tailwind utility classes were not applied. It now uses a site class. Two other sweep findings (a stray "Skip to content", an empty author photo) were full-page-screenshot artifacts of fixed and lazy elements. On the live page the skip link stays hidden until it gets focus, and the author photo loads. |

**Checks.** `pnpm check` (52 unit tests), `pnpm build`, **69/69 browser/axe checks** and Fallow pass; the one clone group is the inherited topic-filter markup. Each element was reviewed in screenshots at 402 px and 1440 px, in EN and RU.
