---
title: Upload complete does not mean product saved
description: Two save buttons can represent different commitments. A lesson from editable product images about drafts, confirmed state, and clear completion feedback.
locale: en
slug: saving-image-and-product
published: true
date: '2026-10-16'
cover: /images/two-saves.svg
coverAlt: Diagram separating image preparation in the editor from confirming the product change
category: Product UX
readingMinutes: 4
tags: [UX, State, Async workflows]
---

An image editor inside a product page has an easy-looking finish line. The user presses Save, the image uploads, and a new preview appears. It is tempting to treat that moment as a committed product change.

But the product page may have its own Save button. The user can still leave without confirming the new image.

## Name the two commitments

In the inSales workflow I worked on, the editor first prepares an image. It exports the result, uploads it, waits for server processing, and replaces the image in the current product form.

The product form then confirms the catalogue change. Those are related operations with different owners and different lifetimes.

Thinking in terms of “the save request” hides that distinction. “Prepare the edited image” and “confirm the product change” make it easier to see which state can still be discarded.

## A flat image and an editable project are different assets

The exported image is not enough to continue editing later. The project also needs text, object positions, styles, source files, and other editor state.

If the user closes the product page without saving, that draft project must not replace the project associated with the image still published in the catalogue. Otherwise, opening the old image later can unexpectedly show an unconfirmed edit.

The state needs a clear relationship to the image version it represents. A successful file upload alone does not establish that relationship for the published product.

## Make progress and completion mean something

During export and server processing, the interface should explain what is happening and prevent edits that would invalidate the operation. After preparation succeeds, the next step must still be understandable.

An error also belongs to a particular stage. A failed upload means something different from a failure to save the product form. Keeping those boundaries explicit helps the interface give a useful retry path instead of a generic “something went wrong.”

## Test the path that discards work

The happy path is important, but it cannot prove the draft boundary. A useful scenario is: edit the image, prepare the result, leave the product without saving, then reopen the original image.

The published image and its editable project should still agree. That observable behaviour is a better test than asserting that two helper methods were called.

The [product image editor case](/work/product-image-editor) covers the larger workflow. This distinction is useful anywhere a nested tool prepares a change that a parent form commits later.
