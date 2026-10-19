---
title: Tools that make creation feel simple
description: A full-screen Vue image editor for merchants. Editable projects, AI operations, templates, and reliable saving connect a reusable canvas engine to a real product workflow.
locale: en
slug: product-image-editor
published: true
cover: /images/image-editor.webp
coverAlt: Two production states of the inSales product image editor, shown in the project presentation
category: Product engineering
year: 2025–2026
role: Vue application, product workflows, and API contracts
stack: [Vue 3, TypeScript, Pinia, FabricJS]
featured: true
order: 1
---

## A product around the canvas

The old product-image tool in inSales offered basic cropping. Merchants needed a way to make complete product graphics without leaving the product page: add text and shapes, apply templates, use AI image operations, and return the result to their catalogue.

I built the full-screen Vue interface from supplied Figma designs and integrated the separate TypeScript/FabricJS editor library. My responsibility was the frontend application and its product workflows. A backend engineer implemented the server; I worked with product, design, backend, and QA on the behaviour and contracts.

## Saving has two boundaries

Exporting an image is only the beginning. The interface uploads the file, splits files larger than 10 MB into parts, waits for server processing, receives the final URL, and replaces the selected product image. The merchant then saves the product itself.

That second boundary matters. Closing the product page without saving must not replace the editable project associated with the previously published image. I kept draft editing state separate from the confirmed product state, rather than treating a successful upload as the end of the workflow.

## State follows a particular editor

The application can have a visible editor and a hidden instance used to transfer changes across product images. Their state must remain separate.

As the interface grew, I divided its product responsibilities into composables for AI operations, templates, crop, backgrounds, canvas size, and saving. Each workflow belongs to the appropriate editor instance. The root component coordinates visible UI decisions instead of owning every operation.

## Long-running operations need honest states

AI processing and server-side image preparation can take time. The interface shows the operation in progress, prevents incompatible edits, handles errors, and only applies a result to the current workflow. It also checks unsaved changes before closing the editor.

The production interface is used by thousands of inSales clients. Its reusable engine has a separate [open-source case](/work/image-editor) and [public demo](https://anu3ev.github.io/image-editor/). The commercial Vue interface is a separate product; the public demo does not reproduce all inSales integrations.
