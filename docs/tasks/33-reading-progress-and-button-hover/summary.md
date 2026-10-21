# 33 — Reading progress and button hover

Two owner requests: a progress bar on content pages so readers see how much is left, and a hover effect for "Let's talk", which "looks too static".

**Reading progress.** `ReadingProgress` draws a 3 px accent line across the top of the screen on case and article pages only.
- It measures the text itself (`.reading-layout` / `.article-body`): empty at the top, full when the end of the text reaches the bottom of the screen. The contact block and footer don't count.
- Scroll and resize are measured at most once per animation frame. The bar is scaled with `transform`, so there is no layout work.
- It is `aria-hidden`: screen readers already report position in a page.
- It is a separate bar rather than part of a sticky header, so the phone keeps all of its height for text.

**Button hover** (devices with hover only).
- Buttons get an accent border, and the arrow moves toward where the link goes: ↗ leans up-right, → moves right, and the code icon stays still. `AppIcon` now exposes its name as `data-icon` for this.
- Primary buttons also get a soft glow in the accent colour.
- The outlined "Let's talk" on the home cover turns accent.
- All buttons dip 1 px when pressed. Reduced-motion users get the end states without animation, through the existing global rule.

**Tests.** `reading-progress.spec.ts`: on an article and a case the bar is hidden from assistive tech, starts at 0, reads about 0.5 halfway through the text, and reaches 1 at the end. Pages that aren't long reads have no bar. Hover states were checked in screenshots.
