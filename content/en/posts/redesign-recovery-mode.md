---
title: The redesign removed the sidebar, and with it the only way to fix a broken page
description: A cleaner visual editor moved widget controls into the storefront preview. When custom code breaks that preview, the controls disappear with it. This is how I found that gap and the recovery mode I built for it.
locale: en
slug: redesign-recovery-mode
published: true
date: '2026-10-21'
cover: /images/blog/redesign-recovery-mode.svg
coverAlt: Three diagrams showing the old sidebar, the redesign where a broken preview hides all widget controls, and a recovery mode that lists widgets without the preview
category: Product UX
readingMinutes: 6
tags: [Product UX, Redesign, iframe, Error recovery]
---

The inSales visual site editor is where merchants change their store's design and manage its widgets. inSales is an e-commerce platform with 60,000+ merchants, and this editor is one of its core tools. The storefront page opens in an iframe inside the admin panel, and the editor lets you work with the widgets on that page.

The old editor had a large permanent sidebar next to the preview, and it was doing four jobs at once: global design settings, page sections, widget lists and the settings of the selected widget. Adding, editing and deleting widgets also worked through buttons inside the preview. So there were two ways to do the same thing, and neither was obviously the main one.

The redesign I was given fixed that. The top menu took over global settings and page navigation. Widget actions moved into the preview: select a widget, click Edit, and a floating panel opens over the storefront with that widget's settings. The permanent sidebar was gone. I got the mockups and spent about eight weeks implementing the frontend.

It's a better interface. It also had a hole that no mockup showed, because mockups show pages that work.

## What the sidebar was quietly doing

Merchants and their developers can put their own HTML, CSS, JavaScript and Liquid into widgets. A critical mistake in that code can stop the storefront page from loading or make it return a server error.

In the old editor that was unpleasant but recoverable. The preview was broken, but the sidebar wasn't part of the preview. You could open the widget list, find the widget that broke the page, and fix its code or delete it.

In the redesign, the main way to reach a widget is the buttons inside the iframe. If the page doesn't load, those buttons don't exist. The merchant loses access to exactly the widget that broke the page, and the editor that's supposed to help shows an error with nothing to click.

Without a dedicated path, recovery meant going to another section of the admin panel and looking for the widget there, or downloading the template, editing it and uploading it back. That's hard enough for someone who knows what went wrong. A merchant who doesn't know which widget caused the error is stuck. Support has the same problem: they can't just open the page and fix it from the editor.

I found this while implementing the new structure, before any merchant could hit it. The sidebar had never been designed as a recovery tool. It just happened to be one, because it didn't depend on the page it was editing.

## Recovery mode

I proposed a technical mode that works without the iframe, and then built it.

When the editor opens, it checks whether the page actually loaded and whether the expected content appeared. If the page failed to load or returned an error, the merchant sees a message offering to open the technical mode. The idea, simplified:

```js
/** Reports a broken preview when the page never shows the content the editor expects. */
function watchPreview({ iframe, timeout, onBroken }) {
  const timer = setTimeout(onBroken, timeout)

  iframe.addEventListener('load', () => {
    clearTimeout(timer)
    if (!hasExpectedContent(iframe.contentDocument)) onBroken()
  }, { once: true })
}
```

The mode itself is a separate window that lists every widget on the current page with its name, ID and available actions. From there you can open the widget's settings, go to its code, or delete it. The list doesn't depend on what's inside the iframe, so a dead preview can't take it down.

Two decisions mattered more than the code.

First, the mode is also available when the page loads fine. Then it's simply another way to see the full widget list and jump to the right block. I didn't want an escape hatch that only shows up during an emergency, because then nobody has seen it before they need it.

Second, it's built for support as much as for merchants. When a merchant doesn't know which widget caused the error, a support engineer can open the page, switch to technical mode, find the problem block, fix or delete its code, and then reopen the page in the normal mode. That's how it's used in production.

## The same gap, in a quieter form

The broken page wasn't the only job the sidebar had been doing silently. Some widgets aren't visible in the normal page content at all: a pre-order form that appears only after a shopper clicks "Pre-order", a feedback form, panels in the bottom area. In the old editor you reached them through the sidebar. In the new one you can't hover over something that isn't on the page yet.

So the top menu got a separate section for these widgets, where merchants can still find, add and configure them. Different symptom, same cause. The redesign removed an interface, and everything that interface made possible had to be moved somewhere on purpose.

## What shipped

The redesigned editor is the standard version for current-generation inSales templates and is used by more than 90% of stores. The old editor with the permanent sidebar remains only for the template generation from before 2020, with a few hundred users.

The new structure also made a proper eight-step onboarding tour possible, where each step points to one stable part of the interface instead of a sidebar that keeps switching its contents.

These numbers describe the redesign as a whole, not the recovery mode on its own:

- With the top menu and the settings panel closed, the preview is about 17% wider on a 1920 px screen, because the sidebar no longer takes a fixed slice of it.
- Among new users, the share who changed a template or widget setting and successfully saved the result on their own during the first session went from 60% to 80%. That's a change of 20 percentage points (from three in five new users to four in five), not a 20% increase.

The recovery mode doesn't have a number of its own. Its result is that a broken page became something you fix from the editor, and support uses it for exactly that.

## Before you delete a panel

This is the checklist I now run whenever a redesign removes or merges a piece of interface:

- List every job the old element does, including the ones nobody drew: error states, empty states, items that stay invisible until some action, and support workflows.
- For each job, find where it lives in the new design. If the answer is "nowhere", say it out loud before release instead of letting support discover it.
- Look at the new design in the state where its main surface fails. If the controls live inside the thing being edited, what happens when that thing doesn't render?
- Keep the escape hatch reachable during normal work, so people know it exists before they need it.

Design reviews usually look at working pages, which is fair, because that's what users see most of the time. The engineer implementing the design is the one who keeps running into the broken states, so that's where these gaps are most likely to be caught.

More about the project is in the [visual editor case](/work/visual-storefront/).
