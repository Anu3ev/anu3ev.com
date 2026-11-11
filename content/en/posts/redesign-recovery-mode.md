---
title: The redesign removed the sidebar, and with it the easy way to fix a broken page
description: In the redesigned inSales visual editor, the widget buttons live inside the store page. When a widget’s code breaks the page, the buttons are gone too. How I found this case and built a recovery mode that doesn’t depend on the page.
locale: en
slug: redesign-recovery-mode
published: true
date: '2026-10-21'
cover: /images/blog/redesign-recovery-mode.svg
coverAlt: 'Three diagrams: in the old editor the sidebar still lists widgets when the page breaks, after the redesign the buttons disappear with the page, and recovery mode lists widgets without the iframe'
category: Product UX
readingMinutes: 7
tags: [Product UX, Redesign, iframe, Error recovery]
---

In the visual site editor, inSales merchants change their store’s design and set up the widgets that store pages are built from. It is one of the platform’s core tools, and the platform has more than 60,000 stores. The store page opens inside an iframe in the editor, and the interface around it controls the widgets and settings.

In 2024 a designer created the mockups of a new editor, and I implemented the frontend of the redesign. Before the redesign, a static sidebar was always open next to the page. It held the global design settings, the widget lists for each page area and the settings of the selected widget.

![The old editor before the redesign: a static sidebar with widget lists by page area on the left, the store page on the right](/images/work/visual-storefront/old-editor-static-sidebar-4th-generation.webp)

Widgets could be managed in two ways: in the sidebar and with buttons right on the page. The editor needed one clear way to manage them, and the sidebar also took up part of the screen. The new editor has no sidebar. The global settings moved to a menu in the top bar, and a widget is managed with buttons that appear when you hover over it. The Edit button opens a floating panel with the settings of that widget.

During the work I found cases that the mockups didn’t cover. The most serious one was a page broken by a widget’s code: without the sidebar, the user would lose access to that widget.

## The sidebar worked even when the page didn’t load

Merchants and their developers add their own HTML, CSS, JavaScript and Liquid code to widgets. If that code has a critical error, the store page inside the iframe may not load or may return a server error.

In the old editor, such a page could be fixed without leaving the editor. The sidebar didn’t depend on what was inside the iframe, so the widget list was still there. The user found the broken widget in it and fixed its code or removed the widget.

After the redesign, widgets are managed with buttons that appear inside the iframe. If the page doesn’t load, those buttons aren’t there. Without a separate solution, the user would lose access to exactly the widget that broke the page. They would have to look for the widget in another section of the admin panel or upload the template again. This is especially hard for a merchant who doesn’t know which widget caused the error, and the support team would have the same problem.

## The button back to the old editor would go away with the full rollout

While the new editor wasn’t enabled for everyone, store admins still had a button that switched back to the old editor with the sidebar. With it, a broken widget could be removed without workarounds, but the button was going to disappear with the full rollout.

When the team decided on 9 July 2024 to roll out the new editor to all stores, I suggested building recovery mode first, with a widget list for pages that don’t load, and rolling out the editor after that. Fixing such pages was usually my job, and without that list it would have been harder. The team lead agreed.

## The recovery mode widget list comes from the server, not from the page

In recovery mode (the interface calls it "Service mode"), the editor shows the page’s widgets grouped by page area: header, content, footer and widgets outside the content. From this list the user can open a widget’s code, fix it or remove the widget.

This list can’t be built from the page itself. Normally the editor finds widgets in the markup of the page loaded in the iframe, but a page that failed to load has no markup. So in recovery mode the editor requests the widget list from the server with a separate request, and the broken page can’t affect it.

Recovery mode can also be opened on a page that loaded normally, from the page settings. Then it simply shows the full list of the page’s widgets.

## The editor waits for the page to report that it has loaded

To open recovery mode, the editor first has to notice that the page didn’t load. In Chrome, the editor sees right away that the expected content didn’t appear on the page. In Firefox, the iframe’s `load` event doesn’t fire in this case, and the editor can’t read what is inside the iframe, so it could wait forever.

So I added a timeout: if the page doesn’t tell the editor within 30 seconds that it has loaded, the editor opens recovery mode. I chose 30 seconds because the server limits a store page request to 25 seconds by default.

Here is a simplified version of the check. A page that has loaded sends the editor a message with `postMessage`, and the editor waits for it for no longer than 30 seconds:

```js
/** 5 seconds more than the server limit for a store page request. */
const PAGE_READY_TIMEOUT_MS = 30_000

/**
 * Calls onPageBroken if the page in the iframe doesn't report
 * that it has loaded within 30 seconds.
 * The load event can't be used here:
 * in Firefox it doesn't fire for such a page.
 */
function watchPageReady(iframe, onPageBroken) {
  const timeoutId = setTimeout(() => {
    window.removeEventListener('message', handleMessage)
    onPageBroken()
  }, PAGE_READY_TIMEOUT_MS)

  function handleMessage(event) {
    const isReadyMessage =
      event.source === iframe.contentWindow &&
      event.data?.type === 'page-ready'
    if (!isReadyMessage) return

    clearTimeout(timeoutId)
    window.removeEventListener('message', handleMessage)
  }

  window.addEventListener('message', handleMessage)
}
```

Only a page that has loaded and run its scripts can send the `page-ready` message. A page with a server error never sends it, so after 30 seconds the editor opens recovery mode in any browser.

## A 408 response froze the editor in Firefox

The second Firefox problem was in the server response itself. When the server couldn’t process the page in time, it returned the status code 408 Request Timeout, and with that response the editor in Firefox froze. In testing, the editor in Chrome was usable again after a few seconds, while in Firefox it took 4 minutes on average. Firefox is known to resend a request after a 408 response: [Mozilla bug 907800](https://bugzilla.mozilla.org/show_bug.cgi?id=907800) describes the browser resending such a request about ten times over several minutes. Firefox 26 limited this behavior, but the browser still resends the request when the 408 arrives on a reused keep-alive connection. To keep the editor from freezing, we decided to change the status code.

Before changing it, I asked in the developers’ channel whether the change would break the integrations with Ozon and Wildberries, two Russian marketplaces. Those integrations also returned 408 in some cases. The discussion showed that only server request handlers and internal platform tasks relied on 408, so the change didn’t break anything for stores. The new code had to be non-standard, so these responses would be easy to find in the logs. The first idea was 540, but Shopify already uses it, so we picked the unused code 555. Now the inSales server returns 555 on a timeout, and the editor no longer freezes in Firefox.

## Widgets outside the page content also depended on the sidebar

Besides broken pages, the sidebar was also the way to manage widgets that aren’t visible on the page. Some widgets appear only after a buyer’s action: for example, the pre-order form opens after the buyer clicks the Pre-order button on a product page. Until then, you can’t hover over such a widget to see its buttons, so without the sidebar these widgets would have been out of reach.

For these widgets I added a "Pop-up windows" section to the top menu. There they can be found, added and set up in the same floating panel. On a page that failed to load, this section is hidden, and widgets outside the content are managed in recovery mode.

## Recovery mode went live a day before the editor rollout

Recovery mode went to production on 31 July 2024, and on 1 August the new editor was turned on for all stores on current templates. Today more than 90% of inSales stores use the new editor. When a merchant doesn’t know which widget caused the error, someone from the support team opens the page, switches to recovery mode, finds the broken widget and fixes or removes its code. After that, the page opens in the normal mode again.

In November 2024 I shipped an updated version of recovery mode. Now, when a page doesn’t load, the editor first shows a "Site loading problems" window with an "Open the widget list" button. The recovery mode widget list became a table that shows when each widget was added and changed and which widgets have edited code. This makes it easier to see which change made the page stop loading.

![Recovery mode as a table: widgets by page area with their change dates and a menu of widget actions](/images/work/visual-storefront/recovery-mode-widget-table.webp)

## What to check before removing a panel

Mockups usually show pages that work. The sidebar helped fix a broken page because it didn’t depend on that page, and the mockups didn’t show this job. So when a redesign removes a part of the interface, it is worth listing everything people could do through it, including error cases and items that aren’t visible on the page. Each of these cases needs a place in the new interface.

The way to recover should also work without the part it helps to fix. In recovery mode the widget list comes from the server, so it opens even when the page in the iframe doesn’t load at all.

The other parts of the redesign are described in the [visual editor case](/work/visual-storefront/).
