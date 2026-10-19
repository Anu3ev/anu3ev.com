---
title: A browser image editor, built to be reused
description: A TypeScript and FabricJS core behind a production editor. Canvas geometry, object lifecycle, history, templates, and export share one predictable contract.
locale: en
slug: image-editor
published: true
cover: /images/editor-history.webp
coverAlt: Layers and history in the public Fabric image editor demo
category: Open source
year: 2025–2026
role: Core library and Vue integration
stack: [TypeScript, FabricJS, Vue, Playwright]
featured: false
order: 3
repository: https://github.com/Anu3ev/image-editor
demo: https://anu3ev.github.io/image-editor/
---

## The problem

Merchants needed to create product images inside inSales. Cropping, rich text, layers, backgrounds, and templates had to feel like one tool, while the editing engine needed to work beyond one product screen.

I started the standalone library in March 2025. Rather than tie canvas behaviour to a Vue component, I gave the editor a public API and a set of focused managers. The same core became the foundation of the production editor and an independently published open-source package.

## My responsibility

I built the reusable TypeScript library and worked on its Vue integration: canvas geometry, object lifecycle, serialization, undo and redo, crop, rich text, templates, export, and browser interactions. The library is used in a production editor serving thousands of inSales clients. This describes the editor’s reach, not a measured commercial impact attributable to one person.

## One object, many entry points

An object can be created, imported, duplicated, grouped, restored from history, or loaded from a template. All of those paths need to preserve IDs, selection behaviour, locks, text styles, and relationships inside groups.

I kept that lifecycle in the core rather than rebuilding it in every toolbar. The serialization contract serves saved projects, history, templates, and clipboard operations. Temporary interactions, such as an active crop, stay separate from saved document state.

## Geometry belongs to the editing engine

Canvas coordinates, viewport zoom and pan, the composition area, and local group coordinates are different spaces. Treating them as interchangeable produces jumps during resize, crop, or restore.

The core owns those conversions. Resizing the canvas updates the viewport rather than moving every object in the saved composition. That keeps the document stable and prevents accumulated offsets.

## Verification and outcome

Jest and Playwright cover the important editing and restoration paths. I also check browser-specific behaviour and the intermediate states of an interaction, rather than only the final screenshot.

The result is a reusable editing engine with its own repository, package, and public demo. It supports PNG, JPEG, SVG, and PDF export. The interactive demo opens separately so the portfolio does not load FabricJS on every page.

[Explore the source code](https://github.com/Anu3ev/image-editor) or [try the live editor](https://anu3ev.github.io/image-editor/).
