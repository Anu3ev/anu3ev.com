---
title: Undo and redo are a product decision
description: Where to draw the line between a user action and a history entry, and why restoring an editor means more than copying visible coordinates.
locale: en
slug: undo-redo-product-decision
published: true
date: '2026-10-20'
cover: /images/undo-redo.svg
coverAlt: Diagram showing before, one user action, after, and the undo path back to the previous state
category: Architecture
readingMinutes: 4
tags: [Architecture, Undo, State]
---

A canvas emits many events during one interaction. Dragging an object may update its position dozens of times. A crop can involve a temporary overlay, a preview, a confirmation, and several changes to the underlying image.

The user usually sees one decision: “I moved this object” or “I applied this crop.” That is the boundary I want the history to preserve.

## Record intentions, not every event

Saving a history entry on every low-level change makes undo feel arbitrary. The first undo may move the object only a fraction of a pixel. A cancelled crop may leave an entry even though the user decided not to change the document.

The editing engine needs a clear start, preview, commit, and cancel contract for temporary interactions. A committed action produces a meaningful history entry. A preview is visible, but it is not automatically a saved document change.

This also matters for performance. Serializing a large document on every pointer movement is expensive work that does not improve the user’s history.

## Restore the document contract

Visible geometry is only part of an object. IDs, locking, selectability, rich-text styles, and relationships inside groups can affect what the next action does.

If duplication restores those properties one way and undo restores them another, bugs appear after apparently unrelated actions. The same serialization and restoration rules should serve saved projects, history, templates, and clipboard operations where their contracts overlap.

That does not mean serializing every temporary UI detail. An open popover or a crop preview belongs to an interaction session, not necessarily to the saved document.

## An asynchronous result still has an owner

Imagine starting image processing, editing something else, and then undoing an earlier action before the result arrives. Applying the result to whichever object happens to be selected is an easy way to corrupt the user’s mental model.

The operation needs the identity and session of its target. Before applying a delayed result, the editor checks that the target and the operation are still current. The policy for recording that result in history is part of the product behaviour, not a side effect to discover after implementation.

## Check the path back

For an important action, I want to verify the visible result, undo it, and redo it. Grouped objects, crop cancellation, and restored text styles deserve particular attention because they cross subsystem boundaries.

The [open-source editor case](/work/image-editor) describes the shared lifecycle behind those paths. The point is a history that follows the user’s decisions, rather than exposing the event stream inside the canvas library.
