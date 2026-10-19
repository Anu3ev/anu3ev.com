---
title: A visual editor, built for getting started
description: Frontend implementation of a supplied redesign, with contextual widget controls, on-demand data, and a recovery path when the storefront preview fails.
locale: en
slug: visual-storefront
published: true
cover: /images/visual-storefront.webp
coverAlt: The visual storefront editor in the inSales administration interface
category: Product engineering
year: 8-week redesign
role: Frontend implementation and recovery workflows
stack: [Vue, JavaScript, REST API, iframe]
featured: false
order: 2
---

## More room for the actual store

The existing inSales visual editor displayed a large permanent sidebar next to the storefront preview. Widget controls were duplicated between the sidebar and the preview itself, while the actual store had limited space.

I implemented the frontend of a supplied redesign over eight weeks. General settings moved into the top navigation; widget settings became a contextual floating panel. This was a redesign of an established product, with existing layouts, widget types, user code, and support workflows to preserve.

## Load data when the workflow needs it

The removed sidebar no longer justified fetching all of its data when the editor opened. I worked on the API contract so the initial request covered the top menu and current context. Widget lists and other details load when the corresponding interface is opened.

The change also gave the preview approximately 17% more width on a 1920 px screen. That is a layout observation for that viewport, rather than a claim that every device gains the same amount of space.

## A broken preview must not trap its owner

The storefront runs in an iframe and can contain user-written code. If an error prevents the page from loading, a design that exposes controls only inside the preview makes recovery impossible.

I identified that missing path and implemented a technical mode. It keeps widget access available when the preview fails, so a merchant or support engineer can fix the code that caused the problem. During settings editing, the iframe is blocked to prevent accidental navigation.

## The result

The project notes record first-session independent edit-and-save completion increasing from 60% to 80%. This is the observed onboarding measure for the redesign, not an isolated experiment proving that one frontend change caused the whole increase.

The new editor became the standard interface for the current generation of inSales store templates. The important engineering result is that everyday editing and failure recovery both remain usable.
