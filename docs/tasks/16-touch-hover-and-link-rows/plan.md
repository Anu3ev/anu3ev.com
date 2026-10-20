# Touch hover and contact link rows

The owner reported on 1.0.10 that the mobile bottom navigation was still buggy and that the Contacts link rows looked strange even with the new padding ([screenshot](screenshots/owner-report-1.0.10.png)): the hover surface stuck out past the left edge of the heading and dividers.

**Navigation.** A touch walk through the bottom panel showed the current item intermittently grey instead of blue ([before](screenshots/taps-before.png)). Touch browsers keep `:hover` on the last tapped element, and `.primary-nav a:hover` (0,2,1) outranked `.primary-nav .nav-active` (0,2,0). The same cascade made the current item turn grey under a desktop pointer. Every hover rule moves under `@media (hover: hover)`, and the active selectors gain the element type so they match hover's specificity and win by order.

**Rows.** The bleed-into-gutter surface from task 14 kept the text aligned but broke the edge alignment. The rows now follow the existing `.feed-more` pattern: the row owns the gutter as padding, so its divider and hover surface span the column while the text remains aligned with the "Find me elsewhere" heading. Focus uses the global ring with an inset offset so it is not clipped at the column edges.

Checks: geometry per reference frame, a touch tap sequence with the pointer left on each tapped item, a desktop pointer over the current item, screenshots in both themes and the full suite.
