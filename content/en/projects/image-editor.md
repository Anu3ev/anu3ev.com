---
title: An open-source image editor core in TypeScript and FabricJS
description: A browser image editor library with a public API, full state serialization, templates, snapping and export to four formats. Image loading became more than 2× faster after I reworked how image data is stored.
locale: en
slug: image-editor
published: true
cover: /images/work/image-editor/demo-sample-composition.webp
coverAlt: The public image editor demo with a sample composition, a selected heading and its object data in the Canvas State panel
category: Open source
year: Mar 2025 – present
role: Sole author and maintainer, from architecture and public API to tests and releases
stack: [TypeScript, FabricJS, Web Workers, Jest, Playwright, GitHub Actions, npm]
featured: false
order: 3
repository: https://github.com/Anu3ev/image-editor
demo: https://anu3ev.github.io/image-editor/
results:
  - value: ">2×"
    label: faster image loading after replacing base64 image data with Blob and Object URLs
  - value: "4"
    label: export formats from one composition, PNG, JPEG, SVG and PDF
---

## The problem

In March 2025 inSales needed a browser editor for product images. The quick path was to put the canvas code inside the Vue screen that would use it. I chose to build it as a separate TypeScript library on top of FabricJS instead: canvas, objects, history and editing rules form a system of their own, and inside one product component they would be hard to test and impossible to reuse.

The library is published as [`@anu3ev/fabric-image-editor`](https://www.npmjs.com/package/@anu3ev/fabric-image-editor) under the MIT license and is the engine of the [inSales product image editor](/work/product-image-editor/). That case covers the product, its users and its AI workflows. This one covers the engine.

## My role

I built the library alone. I designed the architecture and the public API, wrote the code and tests, and set up the build, CI and releases to GitHub Releases, npm and the GitHub Pages demo. The only production consumer I can confirm is my own Vue integration at inSales. I keep maintaining the library after leaving inSales in September 2026.

## What I built

### Managers behind a public API

The editor creates a workspace inside a container the host passes in. Responsibilities are split between managers: `CanvasManager` owns canvas size, the montage area and the viewport, `HistoryManager` stores and restores state, `ShapeManager` keeps a shape and its inner text in sync, `CropManager` holds the temporary crop state, and others for images, text, templates and snapping.

A host application works only through public methods, options and events. It never mutates FabricJS objects directly. Product rules plug in through extension points: the host can forbid deleting a specific object or strip its service data when it is copied, and an async import hook lets the host upload a file first and hand back the prepared source. AI is deliberately out of scope. The host calls its own service and passes the image or text in through the same API.

### One serialization for every way an object appears

An object can be created, imported, pasted, grouped, restored from a saved project, applied from a template or brought back by undo. Each path has to restore Fabric's own properties and the library's data: IDs, locks, selectability, rich-text styles and links between nested objects.

So I made one serialization mechanism serve saved projects, history, templates and the clipboard. Temporary states stay out of it. An active crop lives only during the interaction and reaches history once the user applies it. Operations that change several properties at once are committed as a single history entry, so one user action needs one undo.

![Canvas crop mode in the public demo: a grid over the composition and Apply Crop and Cancel Crop controls](/images/work/image-editor/demo-canvas-crop-mode.webp)

### Geometry in four coordinate spaces

Canvas coordinates, the zoomed and panned viewport, the montage area and local group coordinates are different spaces. Mixing them makes objects jump on resize, crop or restore. The library owns those conversions. When the canvas is resized or a project is restored, it moves the viewport instead of every object, so offsets do not accumulate in the saved composition.

Templates store positions relative to the montage area with start, center or end anchors on each axis, so a template keeps its layout on a workspace of a different size. Snapping to edges, centers and equal spacing, and distance measurement on Alt, are computed during the drag with zoom and transforms taken into account.

### Taking base64 out of editor state

Early versions kept large images as base64 inside objects and history. That bloated every serialized state and put heavy work on the main thread. I replaced it with Blob and Object URLs, added a resource cache with explicit cleanup when an image is replaced or the editor is destroyed, and moved heavy import and export work to Web Workers. Image loading became more than twice as fast, and long operations stopped freezing the interface.

Export renders from a separate copy of the canvas, so the zoom, selection and viewport on screen stay untouched. It also accounts for device pixel ratio and browser zoom, so output size does not depend on the user's display settings.

### Tests that follow the interaction

Jest covers the logic, and Playwright runs browser scenarios for crop, selection, scaling, snapping and text editing. Some bugs only appear mid-drag, so tests also check intermediate states.

In October 2026 I reworked the release and initialization paths. The release workflow now runs typecheck, lint, Jest and browser tests before npm publication, and creates the tag and GitHub Release in a separate job that can be retried without republishing. Initialization now waits for readiness, reports failures and stops stale async work.

## Results

- Image loading is more than twice as fast after the move from base64 to Blob/Object URLs, caching and Web Workers. This is about image loading, not every operation.
- One composition exports to PNG, JPEG, SVG or PDF.
- Public signals, checked on October 21, 2026: 19 GitHub stars, 7 forks and 188 npm downloads in the week of October 12–18. Downloads are not a count of users.
