# Responsive design fidelity

The owner supplied an actual mobile reference after the initial implementation inferred mobile from desktop. Inspect the pinned Home, Blog, Portfolio and Contacts revisions at **402×874**, **1133×744** and **1440×1024** before editing. The browser captures and computed measurements are the baseline; Home/Blog supply the palette for the other screens.

The shared CSS and SiteHeader own the shell, typography and responsive navigation. Replace the mobile logo/disclosure header with the reference's fixed four-link bottom navigation, retaining native links, active-page state, titles and keyboard behavior. Reserve its height and safe-area inset so it cannot obscure the last content or focused controls. Keep one theme toggle and the locale switch in the compact topbar.

Match cover geometry, avatar/CTA alignment, heading/body sizes, section spacing and sidebar dimensions. Correct the Portfolio summary and Contacts email/collaboration cards at their page owners. Preserve real case evidence and published article copy; do not introduce the prototype's draft notices, fake metrics or illustrative product screenshots. Search and topic controls remain functional enhancements even though the pinned Blog reference has no such toolbar.

First verify Home's mobile shell and its desktop/tablet counterpart, then apply the shared measurements to the other pages. Update the existing mobile-menu regression to actual bottom-navigation behavior and check the viewport boundaries. Run content/lint/types/unit/SSG, full browser/axe and Fallow sequentially. Inspect screenshots and keyboard focus in both themes, 320 px reflow and user text spacing. Record intentional content/feature differences and untested browser/screen-reader limits.
