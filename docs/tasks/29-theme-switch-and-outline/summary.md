# 29 — Theme switch and section outline

The owner chose from a page of clickable mockups: the **sun and moon slider** for the theme, the **collapsible outline (B)** on phones, and the current outline block on desktop. The owner also asked for the outline on blog articles, which had none.

**Theme switch.** The bare contrast icon is now a 64 × 32 px slider showing a sun and a moon, with a filled thumb under the current theme. It is a `role="switch"` named "Dark theme" / «Тёмная тема», and `aria-checked` says whether dark is on. The thumb position comes from `data-theme` on `<html>`, which is set before the first paint, so it is right before hydration. The switch stays disabled until hydration, as before.

**Outline.**
- One `ContentToc` for cases and now for articles: a native `<details>` with the list inside a named `nav`.
- Desktop (and readers without JavaScript): the same open block as before, two columns, numbered. Clicking its heading does nothing.
- Phones (≤ 760 px): one 48 px row, "On this page", the number of sections and a chevron. A tap opens the list.
- An article's outline sits inside the first phone screen (721 px from the top at 402 × 874). If it were collapsed only after hydration, the text would jump up, so with `@media (scripting: enabled)` it is drawn collapsed from the first paint. Without scripting that query does not match and the list stays open and usable.

**Tests.** A new `table-of-contents.spec.ts` covers, for a case and an article:
- on desktop the outline stays open when its heading is clicked;
- on a phone it is one row of at least 44 px that opens on tap, and its links jump;
- with the Nuxt scripts blocked it is still collapsed (no layout jump).

The theme tests now find the switch by role and check `aria-checked`.
