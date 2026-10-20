# 14 — Link-block spacing

Version **1.0.10** gives the Contacts "Find me elsewhere" rows inner space on hover and keyboard focus. The highlight now extends 14px past the text on both sides with rounded corners, while the text and dividers keep the MagicPath alignment. Focus uses the same shape as hover. Other link blocks already had padding and were left unchanged.

A browser check per reference frame verifies the painted surface stays clear of the text and inside the column; it failed on the previous CSS. Validation passed: content/lint/types, **51 unit tests**, static export, **61 browser/axe checks** and Fallow. [Review, screenshots and evidence](review.md). Next: the custom domain.

The owner found the bleeding surface misaligned with the heading and dividers on 1.0.10; [task 16](../16-touch-hover-and-link-rows/summary.md) replaces it with full-width rows.
