# 43 — Certificate rows stay inside their lines

Owner report: on About, the hover background of a row in "Other certificates" stuck out past the list's divider lines on both sides.

**Cause.** The row used a negative side margin, so its hover background could reach past the text while the text stayed aligned with the heading. That pushed the background 12 px beyond the divider lines.

**Fix.** Rows now sit exactly between the lines, with no side margin and no hover background. Hover recolours the row text in the accent and nudges the ↗ arrow, like the site's other text links. Keyboard focus keeps the standard focus ring.

**Test.** A new check in `certificates.spec.ts` hovers a row and asserts it stays within the list's left and right edges, with no background colour. On the old styles it would fail by 12 px on each side.

**Release.** This PR also bumps the version to 1.4.0 for the batch #39–#48 from the external review.
