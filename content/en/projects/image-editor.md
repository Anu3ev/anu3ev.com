---
title: An open-source image editor library for the browser, in TypeScript and FabricJS
description: "A browser image editor library in TypeScript and FabricJS with a public API, state serialization, templates and snapping. It powers the inSales infographics editor. After I removed base64 from the editor state, images load more than twice as fast."
locale: en
slug: image-editor
published: true
cover: /images/work/image-editor/demo-sample-composition.webp
coverAlt: The public image editor demo with a sample composition, a selected heading and its object data in the Canvas State panel
category: Open source
year: Mar 2025 – present
context: Open source
role: "Author and maintainer: architecture, public API, tests and releases"
stack: [TypeScript, FabricJS, HTML Canvas, Web Workers, Vite, Jest, Playwright, npm]
featured: false
order: 3
repository: https://github.com/Anu3ev/image-editor
demo: https://anu3ev.github.io/image-editor/
results:
  - value: ">2×"
    label: faster image loading after removing base64 from the editor state
  - value: "2 months"
    label: "from the start of development to the first inSales production release of the editor built on it"
  - value: "4"
    label: "export formats for one composition: PNG, JPEG, SVG and PDF"
  - value: "655"
    label: "npm downloads of the package in the week of 3–9 November 2026"
---
## The problem

In March 2025, inSales started building a browser editor for product photos. The easiest way was to write all the canvas code right in the editor’s Vue component. But the canvas, objects, change history and editing rules together form a separate system, and inside one product component it is hard to test and can’t be reused. So I decided to move this logic into a separate TypeScript library on top of FabricJS, a library for working with objects on a canvas.

The main difficulty was that the editor has many subsystems that depend on each other: images, text, shapes, layers, change history, templates and snapping. Objects must behave the same way when they are created, copied, grouped, added from a template, loaded from a saved state or brought back with undo.

The library is published as [`@anu3ev/fabric-image-editor`](https://www.npmjs.com/package/@anu3ev/fabric-image-editor) under the MIT license. It powers the [inSales product infographics editor](/work/product-image-editor/), where merchants lay text, badges and icons over product photos. More than 3,000 active clients use it. That case covers the product, its users and the AI features; this one is about the library itself.

## My role

I’m the author and maintainer of the library. I started it on 25 March 2025 and used AI agents from the start. I designed the architecture and the public API, wrote the code and tests, and set up the build and CI, publishing to npm and GitHub Releases, and deploying the demo to GitHub Pages. After leaving inSales in September 2026, I still maintain the library.

In October 2026 I reworked the release process. Before, the workflow built the package and published it to npm without type checks, the linter or tests. Now all of these checks, browser tests included, run before publishing, so a broken build can’t reach npm.

## What I built

### The app controls the editor through the public API

The app gives the library an HTML container, and the library creates an editor in it. The editor has a montage area (what design tools call an artboard): it sets the boundaries of the final composition, and only its content goes into the export. Each part of the editor has its own manager class: the canvas, images, text, shapes, the change history, templates and snapping.

The outside app works with the editor through public methods, settings and events, and it doesn’t need to change FabricJS objects directly. Product rules plug in through extension points, so they don’t have to be built into the library’s internal logic. For example, the app can mark one image as the main one and forbid deleting it. When the user copies that image, the app removes the mark from the copy, so a second main image doesn’t appear.

I deliberately kept AI out of the library. The app calls its own AI service and passes the resulting image or text through the same public API, so new AI features don’t add product dependencies to the library.

### An object is restored the same way, however it appeared

An object can be created, imported, pasted from the clipboard, grouped, restored from a saved project, added from a template or brought back with undo. In each case, the editor has to restore both the FabricJS properties and the library’s own data: IDs, locking, whether it can be selected, text styles and links between nested objects.

So I built a single serialization mechanism: the editor state is saved to JSON and restored from it. Saved projects, the change history, templates and the clipboard all run on it.

### The composition changes only when a crop is applied

Cropping is a separate temporary mode, and the user can crop either an image or the whole montage area. While the user moves and resizes the frame, the composition doesn’t change. The Apply Crop button saves the result to the history, and after the Cancel Crop button is clicked, the composition stays as it was.

![Canvas crop mode in the public demo: a frame with a grid over the composition, and the Apply Crop and Cancel Crop buttons in the right panel](/images/work/image-editor/demo-canvas-crop-mode.webp)

### One user action is undone with one undo

The change history follows the user’s actions, not every internal operation. For example, when the text in a shape gets longer, the library changes the text and recalculates the shape’s size. These are several changes, but history saving is paused for the operation, and only the final state is saved. So the user undoes the whole action with one undo.

### Coordinates are converted between four systems

FabricJS calls the visible part of the canvas the viewport. It changes when the user zooms or pans. The editor works with four coordinate systems at once: canvas coordinates, viewport coordinates, montage area coordinates and the local coordinates of objects inside groups. If they get mixed up, objects shift after a resize, a crop or a project restore. So the library converts coordinates itself when objects are moved, scaled, rotated or cropped and when a state is restored.

![Nested areas: the canvas, the viewport inside it, the montage area inside the viewport and a group of objects inside the montage area. On the right, two notes: when the canvas size changes, only the viewport moves, and if the systems get mixed up, objects shift](/images/work/image-editor/coordinate-systems.svg)

At first, when the canvas size changed, the library moved the montage area and then all the objects, and recalculated their coordinates every time. In March 2026 I changed the approach: the montage area and the objects keep their coordinates, and only the viewport moves. Object coordinates are no longer recalculated on every resize, so small errors don’t build up and the saved composition doesn’t change by accident.

### A template keeps its composition on a montage area of a different size

Templates store object positions relative to the montage area, plus an anchor for each axis: the start, the center or the end. So a template can be applied to a montage area of a different size, and the composition stays the same. For example, an object anchored to the end of the horizontal axis stays at the right edge even when the montage area gets wider.

Bulk transfer in the infographics editor uses the same mechanism: one photo’s design is saved as a temporary template and applied to the product’s other photos.

### I added snapping while building infographic templates myself

In the infographics editor, merchants get ready-made templates with text, badges and shapes already in place, so they don’t have to build a marketplace image from scratch. I built these system templates myself, right in the editor, from the designer’s Figma mockups. While doing it, I noticed that objects could only be placed by eye: you couldn’t see whether the edges of two badges lined up or whether the spacing between them was equal. I couldn’t match the mockup exactly.

I wanted the editor to help the way Canva does: an object snaps to the edge or center of its neighbor, and you can see the distances between objects. So in November and December 2025 I added snapping and guides to the library. I built them for my own templates, and then merchants started using them too.

An object snaps to the edges and center of the montage area, to the edges and centers of nearby objects, and to positions where the spacing between objects is equal. When an object snaps, the editor shows a guide, and snapping turns off while Ctrl is held. When you hold Alt, the editor shows the distances from the selected object to nearby objects and to the edges of the montage area. All of this is calculated while the object is being dragged and takes the zoom, the viewport and object sizes after transforms into account.

![Two frames from the public demo. On the left, a button is being dragged: it has snapped to the left edge of the illustration, a guide shows the alignment, and two 43 labels show equal spacing between the heading, the illustration and the button. On the right, with Alt held, the editor shows the distances from the button to the edges of the montage area](/images/work/image-editor/demo-snapping-and-measurements.webp)

### Text stays inside its shape

A shape with text inside is a compound object in the library: the shape and the text must stay consistent through any change. If there is enough room, the shape can grow with the text, and once it reaches its maximum width, the text starts wrapping. This works the same way during resizing, after the mouse button is released, when restoring from history, when copying and when applying a template.

### Without base64, images load more than twice as fast

In early versions, large images could be stored inside objects and the change history as base64. Because of this, an image object became large. The change history works like this: `HistoryManager` keeps a base state and a list of changes relative to it. On every save, the library serializes the whole editor state and compares it with the previous one using `jsondiffpatch`. The base64 strings were part of that state, so saving to the history was slow. Copying and exporting also blocked the interface, because the image was converted to base64 on the browser’s main thread.

So I moved images to Blobs and Object URLs: the editor state now keeps a short link instead of the file content. Loaded images are cached as Blobs, so undo and redo don’t load them again. The browser keeps a Blob in memory until its Object URL is revoked, so Object URLs are revoked when an image is replaced or the editor is destroyed. Heavy import and export work now runs in Web Workers.

After base64 was removed, images started loading more than twice as fast, saving to the history stopped being slow, and long operations stopped blocking the interface.

### Export doesn’t change what the user sees on screen

A composition can be exported to PNG, JPEG, SVG or PDF. On screen, the montage area is scaled to fit the container and centered in it. The file, however, must contain only the montage area at its real size. To get it, the editor has to change the zoom, move the montage area to the corner of the canvas, and then put everything back. On the visible canvas, the user would see these changes. So the export is rendered from a separate copy of the canvas, and the zoom, selection and viewport on screen don’t change.

The copy is rendered without device pixel ratio scaling and ignores browser zoom. So a 512×512 composition is saved as a 512×512 file on both a regular screen and a high-density one.

### Tests check intermediate states too

Jest covers the library’s logic, and Playwright checks cropping, selection, zoom, snapping and text editing in a browser. Some bugs appear only in the middle of a drag or a resize, so the tests go through the intermediate states and separately check the result after the action ends.

## Results

- The library became the base of the inSales infographics editor, which more than 3,000 active clients use, and it is still a separate package that can be developed independently of the product.
- The first version of the editor built on it went to production at inSales behind a feature flag on 30 May 2025, two months after development started.
- After base64 was removed, images load more than twice as fast.
- The library can be installed from npm and tried in the [public demo](https://anu3ev.github.io/image-editor/). The demo uses the same public methods that are available to an outside app. As of 11 November 2026, the repository has 20 stars and 6 forks on GitHub, and the package had 655 npm downloads in the week of 3–9 November.
