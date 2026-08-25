# Accessibility and UX Audit

**Scope:** Revised responsive static prototype

**Target:** WCAG 2.2 AA
**Reviewed:** 2026-08-25

## Result

The final local revision passes the automated semantic, responsive, keyboard, contrast, localization-expansion, and reduced-motion checks defined for the design phase. This validates the static design contract, not the future Nuxt runtime.

## Standards and test set

- WCAG 2.2 AA for contrast, focus, semantics, reflow, target size, input, and motion.
- WAI form patterns for persistent labels, instructions, validation, errors, and status messages.
- Explicit `lang` and equivalent-route behavior for English and Russian.
- A project target of at least 44 by 44 CSS px for primary controls.
- Public-page test matrix: 18 pages at 390, 768, and 1440 px.

## Contrast results

| Pair | Ratio | Requirement | Result |
| --- | ---: | ---: | --- |
| Dark primary text / canvas | 17.41:1 | 4.5:1 | Pass |
| Dark secondary text / canvas | 8.99:1 | 4.5:1 | Pass |
| Dark tertiary text / canvas | 5.34:1 | 4.5:1 | Pass |
| Dark brand text / canvas | 8.12:1 | 4.5:1 | Pass |
| Dark on-brand text / brand action | 6.11:1 | 4.5:1 | Pass |
| Dark strong control border / canvas | 3.49:1 | 3:1 | Pass |
| Light primary text / canvas | 16.43:1 | 4.5:1 | Pass |
| Light secondary text / canvas | 7.72:1 | 4.5:1 | Pass |
| Light tertiary text / canvas | 4.99:1 | 4.5:1 | Pass |
| Light brand text / canvas | 7.91:1 | 4.5:1 | Pass |
| Light on-brand text / brand action | 8.74:1 | 4.5:1 | Pass |
| Light strong control border / canvas | 3.26:1 | 3:1 | Pass |
| Dark status text / status background | 5.19-6.03:1 | 4.5:1 | Pass |

The dark strong border was corrected from `#574A41` to `#75665B`. The matching Figma alias remains pending because Figma synchronization is blocked by the Starter MCP quota.

## Automated checks

- `html-validate` passed all 19 HTML files, including the internal state board.
- Pa11y with axe-core passed all 18 public pages. The first full pass exposed one narrow-column layout defect on the Russian case page; the fact rail was corrected and that page passed on retest.
- The responsive browser suite executed 54 page-width combinations. No page produced horizontal scroll and every image loaded successfully.
- The portrait retained its natural 1:1 ratio and rendered without `object-fit` face cropping.
- 27 synthetic 30% text-expansion checks passed without horizontal overflow.

## Keyboard and interaction review

- The first focusable control is the visible 44 by 44 theme switch; Space changes the theme.
- The skip link is next in keyboard order and becomes visible on focus.
- The mobile menu uses a native disclosure and opens from the keyboard.
- Focus indicators use a visible 3 px ring with an offset.
- Navigation, language selection, form controls, and direct contact links remain usable without pointer input.
- The contact reason defaults to `job-opportunity` and uses the documented three-value contract.
- `prefers-reduced-motion: reduce` collapses transition duration and removes smooth scrolling.

Production requirements remain: close the implemented mobile menu on Escape and route change, return focus to its trigger, preserve user input after failed submission, focus an error summary or first invalid field, and announce asynchronous form status.

## Responsive and localization review

- The system is mobile-first, single-column where reading order matters, and uses 720 and 960 px composition breakpoints.
- Every public template has an English and Russian version with a link to the equivalent route.
- Russian does not use reduced type sizes to fit the layout.
- Heading, control, and navigation fixtures survive at least 30% expansion.
- The English home measures 6,425 px and the Russian home 6,783 px at 390 px, reduced from the previous 9,000-plus-pixel composition.
- Product figures preserve image legibility; optional media is omitted rather than replaced with a public placeholder.

## Corrections made during the audit

- Corrected low-contrast secondary labels, captions, and control borders.
- Corrected the Russian case-fact desktop layout by keeping facts in one readable column inside the rail.
- Added global intrinsic image sizing to prevent distorted screenshots.
- Restored a visible and keyboard-operable theme control.
- Replaced portrait cropping with a natural square presentation.
- Removed decorative and duplicated mobile sections that did not add evidence.

## Remaining runtime boundary

After Nuxt implementation, repeat screen-reader name checks, real form error and live-region behavior, 200% zoom/reflow, route-preserving locale switching, browser back/forward state, production image loading, and reduced-motion behavior. These cannot be proven by the static prototype alone.
