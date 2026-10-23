# 40 — Drop the decorations

From the external portfolio review, approved by the owner: four elements looked like content but said nothing.

| Removed | Where |
|---|---|
| "Personal space" / «Разделы» | caption above the desktop sidebar navigation |
| "↳ Pinned note" / «Закреплённая заметка» | eyebrow above the home intro to the cases (the heading and text stay) |
| `<ideas /> → interfaces` | code-style tagline on the home cover |
| "01 / 05" page counter | topbar, next to the language link |

The topbar keeps its section title, language link and theme switch. The counter's number mapping is gone from `PageTopbar`, which now maps only section titles. The unused copy keys and styles were deleted.

**Tests.** The topbar alignment test now checks the language link and theme switch. The cover test no longer measures the removed tagline; it still checks that the label is clear of the shapes and that the button lines up with the avatar.
