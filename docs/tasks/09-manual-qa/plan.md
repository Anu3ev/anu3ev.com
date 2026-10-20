# Manual browser testing

## Order

Automatic deployment is complete: production and Release 1.0.3 identify commit `d073e5b8101123a451dd900a09f88b068017da40`. Guest HTTP checks confirm no-store/noindex on the CMS entry, configuration and bundle. This task comes next; repository-wide English documentation follows afterward.

## Acceptance before editing

- Reproduce the reported blog search focus in the rendered browser. The complete rounded field, including its icon, must have one clear focus indicator. Preserve the native search input, accessible name, title, text selection and keyboard operation. Disable irrelevant saved browser search suggestions.
- Check pointer and keyboard navigation, skip link, mobile menu/Escape/focus return, themes, locale switching and browser history. Inspect search/filter/empty/clear states rather than only the initial page.
- Read all public page templates and case/article routes, inspect images and links, check mobile/reflow/zoom and both languages/themes. Verify actual focus visibility, clipping and contrast visually; axe alone is not evidence of visual quality.
- Fix reproducible findings at their existing owner. Add only useful regression coverage and run the affected checks, then review the whole diff and repeat the changed paths.
- Commit, push and merge this task; verify that its fixes arrive through the automatic production pipeline before proceeding to English documentation.

Record the actual browser actions, findings, fixes and verification limits in `review.md` and `summary.md`. Do not describe scripted geometry/axe checks as a manual visual review.

The subsequent design task must use the actual MagicPath Mobile 402×874, Tablet 1133×744 and Browser 1440×1024 frames. The user identified the fixed mobile bottom navigation and mismatched spacing/sizing. That visual correction follows English documentation; passing the current functional checks is not design acceptance.

After all previous tasks, connect anu3ev.com. The user offered a Zomro browser login for DNS management. Domain work is now an explicit final task, rather than an optional fallback.
