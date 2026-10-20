# Link-block spacing

The owner's screenshot shows the Contacts "Find me elsewhere" list: on hover, the row surface starts exactly at the "Telegram / @anu3ev" text, so the highlight has no inner space. The list container carries the 28px (20px mobile) gutter while the link itself has only vertical padding, and the hover background is painted on the link box.

The MagicPath Contacts reference aligns row text and dividers with the section heading and does not define a hover state. The resting layout therefore stays unchanged. Each row gets a `::before` surface that bleeds 14px into the gutter on both sides (inside both gutters) with a 7px radius; hover paints that surface, and keyboard focus draws the ring on the same shape so both states share one geometry. Dividers stay visible because the surface ends at the row's padding box.

Other hover surfaces were audited: primary navigation, `feed-more`, buttons and icon buttons already have their own padding; the right-column profile list only changes colour.

Checks: resolved geometry at 402/1133/1440 (text unchanged, surface ≥12px before the text and inside the main column), hover and Tab focus screenshots in both themes, the full unit/browser/axe suite and Fallow.
