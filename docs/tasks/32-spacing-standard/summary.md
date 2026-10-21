# 32 — Spacing standard

The owner found uneven gaps on the mobile About page and asked to bring every padding, margin and gap to one standard: it may differ between desktop and mobile, but must be the same across blocks and pages.

**Cause.** The stylesheet used about 40 different spacing values (5, 7, 9, 13, 17, 19, 23, 27 px and so on). Neighbouring blocks each added their own outer space, so gaps stacked differently. On About on a phone: heading → photo 58 px, last job → "How I work" 72 px, last card → contact block 78 px.

**Standard** (top of `main.css`).
- A 4 px scale: `--space-1…12` = 4, 8, 12, 16, 20, 24, 32, 40, 48 px.
- Semantic tokens, desktop / mobile, redefined once in the mobile media query:

| Token | Desktop | Mobile | Used for |
|---|---|---|---|
| `--gutter` | 28 | 20 | side padding of every block and band |
| `--section-space` | 40 | 32 | between top-level blocks, and on each side of a divider line |
| `--block-gap` | 24 | 20 | heading → content inside a block |
| `--card-padding` | 24 | 20 | cards and list rows |
| `--band-padding` | 16 | 16 | toolbars, "see all" rows, footer |

- Rule: a block never adds outer space on top of its neighbour's. The last timeline item has no bottom padding. The About grid adds only bottom space. The last card in a list drops its line, because the next band's top line closes the list. Home's "All projects" row draws its own line after the card list.
- About 30 mobile overrides that only restated values for 20 px are gone; the tokens handle them.
- The empty Tailwind `h-20` spacer at the end of the blog list is removed.

**Found while measuring.**
- On Blog, Work and Contact the heading started 7 px lower than elsewhere: their eyebrow is an inline `<span>` inside a 16 px line box. It is now a block.
- The theme switch icons sat at the top of the track (the owner's report); the track now centres them.

**Exceptions.** Five raw lengths are drawing geometry, not spacing: the theme switch thumb inset, the sidebar offsets that line the wordmark up with the topbar, the cover stripe gap, and the avatar's overlap with the cover. They are listed in the test.

**Tests.**
- Unit `spacing.test.ts` fails on any raw `px` in a padding, margin or gap outside the five exceptions, so new rules cannot bypass the scale.
- E2e `spacing.spec.ts`, mobile and desktop:
  - the three About gaps from the owner's screenshots and the callout padding equal `--section-space`;
  - the first heading on About, Blog, Work, Contact and Privacy starts `--section-space` below the topbar.
- Also new: a check that the switch icons are centred, and that a card list keeps exactly one divider before the next band.

Full-page screenshots of About, Home, Contact, a case, Blog and Work at 402 px, and of About and a case at 1440 px, were checked by eye.
