---
title: A Vue editor should clean up after itself
description: Notes on component lifecycles, listeners, and keeping a long-running browser editor predictable when its interface opens, closes, or changes documents.
locale: en
slug: vue-editor-cleanup
published: true
date: '2026-10-20'
cover: /images/vue-lifecycle.svg
coverAlt: Diagram connecting onMounted to resource creation and onUnmounted to cleanup
category: Vue.js
readingMinutes: 5
tags: [Vue, Lifecycle, Browser editors]
---

An editor is a useful stress test for a frontend architecture. It may stay open for a long time, create temporary controls, replace its document, start asynchronous work, and disappear while that work is still running.

In my image-editor work, the difficult bugs often lived between those events. The canvas looked fine on the first opening. The problem appeared on the next opening, after a crop was cancelled, or after an old request completed.

## Start with ownership

For each resource, I want to know who creates it and when that owner stops needing it. That includes more than the canvas itself:

- document and window listeners;
- observers and timers;
- object URLs created for imported or exported files;
- subscriptions to editor events;
- asynchronous operations that can still deliver a result.

The component that displays a toolbar does not automatically own the editing engine. Equally, a module-level composable should not turn two editor instances into one shared session by accident.

## Pair creation with disposal

For a listener scoped to one mounted component, Vue gives the boundary directly:

```ts
const viewport = useTemplateRef<HTMLDivElement>('viewport')

/** Measures the visible editor container; a hidden or unmounted viewport has no current size. */
function updateViewportSize() {
  const element = viewport.value
  if (!element) return

  editor.resize({ width: element.clientWidth, height: element.clientHeight })
}

onMounted(() => {
  window.addEventListener('resize', updateViewportSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportSize)
})
```

This is a partial example: `editor` is an existing instance whose resize contract accepts the current container size. It demonstrates listener ownership, not a complete responsive canvas implementation. A real editor may need a ResizeObserver and explicit rules for zero-size hidden containers instead.

## Cleanup is not request cancellation

Removing a listener does not stop a request that already started. An AI operation or image upload can finish after the user changes the active document.

The result needs an ownership check before it becomes visible state. Depending on the operation, I use an abort signal, a document identifier, or a generation snapshot. The important point is the order: wait for the result, confirm that its session is still current, then apply it.

Cancelling a browser request also does not prove that a server operation stopped. The UI needs to be honest about that difference.

## Test the second opening

The first render is only one state of the system. Useful checks include opening and closing the editor twice, switching the document during an operation, cancelling an interaction, and restoring state through undo.

I prefer a small number of tests around those boundaries to many assertions that a component called its own helper. The failure matters because a user gets stale content, duplicate commands, or a resource that never goes away.

The [Vue product editor case](/work/product-image-editor/) describes how these ownership boundaries fit a production workflow.
