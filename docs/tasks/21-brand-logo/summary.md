# 21 — Brand logo

The domain carries the idea: **anu3ev** is Anu-*fri*-ev with «три» (three) written as **3**. The logo highlights that 3, so the domain is easy to remember and explains itself.

- **Mark:** a geometric "3." in a rounded tile, drawn as a path so it renders without fonts. The period continues the previous "a." mark. An accent-coloured tile was chosen over a dark one: in the size test (16, 32, 64 and 180 px on light and dark tab bars), a dark tile disappeared on dark browser chrome. [Icon sizes](screenshots/icon-sizes.png).
- **Wordmark:** `anu3ev.com` next to the mark in the sidebar. The 3 uses the accent colour and `.com` is muted. It is HTML text, so it follows the theme, scales with zoom and keeps the old 46 px row, so the navigation does not move. The inline SVG uses the theme tokens (`--accent`, `--accent-ink`): light blue with dark ink in the dark theme, deep blue with white in the light theme. [Both themes, desktop and tablet](screenshots/sidebar-themes.png).
- **Devices:** `favicon.svg` is the mark; `build-metadata` renders the 48 px favicon, the 180 px Apple touch icon and the 192/512 px manifest icons from it. The default Open Graph card uses the mark and wordmark instead of a plain text line. On mobile the sidebar header stays hidden, as in the MagicPath mobile frame, so the mark appears there as the tab and home-screen icon.
- **Accessibility:** the SVG is `aria-hidden`. The link's accessible name starts with the visible text (`anu3ev.com · Alexander Anufriev · Home`), which the label-in-name check requires.

Validation: `pnpm check` (51 unit tests), `pnpm build`, and **69 browser/axe checks**, including a new accessible-name assertion for the wordmark.
