---
title: An open-source image editor library for the browser, in TypeScript and FabricJS
description: "A browser image editor library in TypeScript and FabricJS with a public API, full state serialization, templates and snapping. It powers the inSales infographics editor, and after I removed base64 from the editor state, images load more than twice as fast."
locale: en
slug: image-editor
published: true
cover: /images/work/image-editor/demo-sample-composition.webp
coverAlt: The public image editor demo with a sample composition, a selected heading and its object data in the Canvas State panel
category: Open source
year: Mar 2025 – present
context: Open source
role: Sole author and maintainer, from architecture and public API to tests and releases
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
---
## The problem

In March 2025, inSales started building a browser editor for product photos. The easiest way was to write all the canvas code right in the editor’s Vue component. But the canvas, objects, change history and editing rules together form a separate system, and inside one product component it is hard to test and can’t be reused. So I decided to move this logic into a separate TypeScript library on top of FabricJS, a library for working with objects on a canvas.

The main difficulty was that the editor has many subsystems that depend on each other: images, text, shapes, layers, change history, templates and snapping. Objects must behave the same way when they are created, copied, grouped, applied from a template, loaded from a saved state or brought back with undo.

The library is published as [`@anu3ev/fabric-image-editor`](https://www.npmjs.com/package/@anu3ev/fabric-image-editor) under the MIT license. It powers the [inSales product infographics editor](/work/product-image-editor/), which more than 3,000 active clients use. That case covers the product, its users and the AI features; this one is about the library itself.

## My role

I started the library on 25 March 2025 and built it alone, using AI agents from the start. I designed the architecture and the public API, wrote the code and tests, and set up the build, CI and publishing to GitHub Releases and npm, and the demo on GitHub Pages. After leaving inSales in September 2026, I still maintain the library.

## What I built

### The app controls the editor only through the public API

The app gives the library an HTML container, and the library creates an editor in it with a working area (the montage area) that defines the boundaries of the final composition. Inside, responsibilities are split between manager classes. `CanvasManager` handles the canvas size, the working area and the viewport. The viewport is the visible part of the canvas, and it changes with zoom and panning. `HistoryManager` saves and restores state, `ShapeManager` keeps a shape in sync with the text inside it, and `CropManager` holds the temporary crop state. There are separate managers for images, text, templates and snapping.

The outside app works only through public methods, settings and events and never changes FabricJS objects directly. Product rules plug in through extension points: for example, the app can forbid deleting a system object or remove an internal ID from a copy before pasting it. With an async import hook, the app can first upload a file to its own server and return a ready-to-use image source to the library.

I deliberately kept AI out of the library. The app calls its own AI service and passes the resulting image or text through the same public API, so new AI features don’t add product dependencies to the library.

### An object is restored the same way, however it appeared

An object can be created, imported, pasted from the clipboard, grouped, restored from a saved project, taken from a template or brought back with undo. On each path, the editor has to restore both the FabricJS properties and the library’s own data: IDs, locking, whether it can be selected, text styles and links between nested objects.

So I built one serialization mechanism: the editor state is saved to JSON and restored from it. Saved projects, the change history, templates and the clipboard all run on it. Temporary states are not saved: a crop goes into the history only when the user applies the result.

![Canvas crop mode in the public demo: a grid over the composition and Apply Crop and Cancel Crop controls](/images/work/image-editor/demo-canvas-crop-mode.webp)

The change history reflects the user’s actions, not every internal operation. Some actions are technically several changes, and when needed they are saved to the history as one step, so one user action is undone with one undo.

### Coordinates are converted between four systems

The editor works with canvas coordinates, viewport coordinates, working area coordinates and the local coordinates of objects inside groups at the same time. If they get mixed up, objects shift when the size changes, after a crop or when a project is restored, so the library converts coordinates between these systems itself. When the canvas size changes or a project loads, the library moves the viewport instead of the objects, so rounding errors don’t accumulate in the saved composition.

### A template keeps its layout on a working area of a different size

Templates store object positions relative to the working area, with an anchor at the start, center or end of each axis. So a template can be applied to a working area of a different size, and the layout stays the same. Copying one photo’s design to all photos of a product in the infographics editor uses the same mechanism: the design of one product photo is saved as a temporary template and applied to the product’s other photos.

### I added snapping while building infographic templates myself

In the infographics editor, merchants get ready-made templates with text, badges and shapes already in place, so they don’t have to build a marketplace image from scratch. I built these system templates myself, right in the editor, from the designer’s Figma mockups. While doing it, I noticed that objects could only be placed by eye: you couldn’t see whether the edges of two badges lined up or whether the spacing between them was equal. I couldn’t match the mockup exactly.

I wanted the editor to help the way Canva does, so in November and December 2025 I added snapping and guides to the library. An object snaps to the edges and center of the working area, to the edges and centers of nearby objects and to positions with equal spacing between objects, and when you hold Alt, the editor shows the distances to them. All of this is calculated while the object is being dragged and takes zoom and object transforms into account. I built it for my own templates, and then merchants started using snapping too.

### Text stays inside its shape

Shapes with text inside are compound objects in the library: the shape and the text must stay consistent through any change. If there is enough room, the shape can grow with the text, and once it reaches its maximum width, the text starts wrapping. This logic has to work the same way during resizing, after the mouse button is released, when restoring from history, when copying and when applying a template.

### Without base64, images load more than twice as fast

In early versions, large images were stored in objects and in the history as base64, the whole file encoded as a text string. Because of that, image objects became large and saving to the history was slow. Copying and exporting also froze the page, because the image was converted to base64 on the browser’s main thread. I switched images to Blobs and Object URLs and added caching for loaded resources, and Object URLs are revoked when an image is replaced or the editor is destroyed. Heavy import and export work now runs in Web Workers. Images started loading more than twice as fast, and long operations stopped freezing the interface.

### Export doesn’t change what the user sees on screen

A composition can be exported to PNG, JPEG, SVG or PDF. To produce the final file, the editor has to change the zoom and move the working area to the corner of the container, and then put everything back. So instead of changing the visible canvas, the editor renders the export from a separate copy, and the zoom, selection and viewport on screen don’t change. Device pixel ratio and browser zoom are taken into account, so the size and quality of the final image don’t depend on the user’s screen settings.

### Tests check intermediate states too

Jest covers the logic, and Playwright checks cropping, selection, zoom, snapping and text editing in a browser. Some bugs appear only in the middle of a drag, so the tests check the intermediate states too, not only the result.

In October 2026 I reworked the release process: now the GitHub Actions workflow runs type checks, the linter, Jest and the browser tests before publishing to npm, and a separate job creates the tag and the GitHub Release; that job can be rerun without publishing to npm again.

## Results

- The library became the base of the inSales infographics editor, which more than 3,000 active clients use, and it is still a separate package that can be developed independently of the product.
- The first version of the editor built on it went to production at inSales behind a feature flag on 30 May 2025, two months after development started.
- Images load more than twice as fast after removing base64, caching resources and moving import and export to Web Workers.
- Public numbers as of 21 October 2026: 19 stars and 7 forks on GitHub, 188 npm downloads in the week of 12–18 October.
