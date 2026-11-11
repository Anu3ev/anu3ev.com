---
title: Visual site editor redesign for inSales storefronts
description: "I implemented the frontend of the inSales visual site editor redesign: removed the static sidebar, split the interface into a top menu, the page and a floating settings panel, and built recovery mode for pages that don’t load because of a widget’s code."
locale: en
slug: visual-storefront
published: true
cover: /images/work/visual-storefront/floating-widget-settings.webp
coverAlt: Redesigned inSales visual editor with a floating settings panel for the selected promo slider over a full-width storefront preview
category: Browser editors
year: Apr 2024 – Nov 2024
context: inSales
role: "Implemented the redesign frontend and recovery mode; owned the release"
stack: [Vue.js, TypeScript, JavaScript, SCSS, Vuetify]
featured: false
order: 2
results:
  - value: "90%+"
    label: "of inSales stores use the redesigned editor"
  - value: "60% → 80%"
    label: "new users who changed and saved a template or widget setting on their own in the first session"
  - value: "≈17%"
    label: "wider storefront preview on a 1920 px screen with the panels closed"
---

## The problem

In the visual site editor, inSales merchants change their store’s design and set up the widgets that store pages are built from. The page opens inside an iframe in the editor, and the interface around it controls the widgets and settings.

Before the redesign, a static sidebar was always open next to the page. It held the global design settings, the page areas with their widget lists and the settings of the selected widget, all at once.

![The old editor before the redesign: a static sidebar with widget lists by page area on the left, the store page on the right](/images/work/visual-storefront/old-editor-static-sidebar-4th-generation.webp)

This caused three problems:

1. Widgets could be managed in two ways: in the sidebar and with buttons right on the page. The editor needed one clear way to manage them.
2. The sidebar took up part of the screen, so the site preview was narrower than it could be.
3. An onboarding tour would have had to switch between levels of the same sidebar: global settings, page areas, widget lists and widget settings. A new user would struggle to understand what they were being shown.

## My role

A designer created the mockups of the new editor, and I implemented the frontend of the redesign. The main work took about 8 weeks. Besides building the new interface, the backend developer and I changed the API, and I reworked how the editor loads data and works with the iframe. During the work I found cases the mockups didn’t cover. For the most serious one, pages that don’t load because of an error in a widget’s code, I suggested and implemented recovery mode.

I also owned the release. First I described how to ship the changes in parts behind a feature flag: while the flag is off, the new code doesn’t affect the current editor, QA can check small parts, and if a bug shows up later, the commit that caused it is easier to find. In July 2024 I was asked to roll out the new editor to all stores on current templates and remove the old one.

## What I built

### Each part of the screen has one job

I removed the static sidebar. The global design settings and page navigation moved to a menu that opens from the top bar and closes when it isn’t needed. Widgets are managed right on the page: hovering over a widget shows its buttons. So widgets now have one way to be managed.

![The new editor: the top bar menu with the list of store pages is open, the store page is on the right](/images/work/visual-storefront/new-editor-top-menu-pages.webp)

The "Edit" button opens a floating panel with the settings of that widget only. I implemented it as a separate component and moved the rendering of widget settings into it. The panel can be placed on the left or right, and it appears over the page without moving it. When the user finishes with the settings or starts scrolling the page, the panel hides.

![The floating settings panel of a promo slider over the store page](/images/work/visual-storefront/floating-widget-settings.webp)

While the panel is open, the user could accidentally click a link inside the widget, and the iframe would open another page in the middle of editing. So during that time a layer covers the iframe and catches the clicks.

Without the static sidebar, the site preview on a 1920 px screen is about 17% wider with the panels closed.

### The onboarding tour shows the interface one part at a time

Once each part of the screen had one job, the onboarding tour for the first visit could go step by step. In eight steps it shows how to choose a page, the template settings, the top bar buttons and how to manage widgets on the page. Each step points to a separate part of the interface that doesn’t change while the user looks at it.

![The first onboarding step, "Selecting the page to edit", next to the menu of pages](/images/work/visual-storefront/onboarding-page-selection-step.webp)

### Data loads when the interface needs it

When it opened, the old editor loaded everything the sidebar showed in one request: the design settings, the layouts (the sets of widgets for each page type) and every widget list. The backend developer and I split the API to match the new interface: on opening, the editor requests only the data for the top menu, and it requests a widget list when the user opens it. The first response had been only about 5–10 KB, so this didn’t make anything faster. The point was different: the API now matches the new interface and no longer returns data for a sidebar that doesn’t exist.

### Switching pages updates both the iframe and the editor settings

In the top menu I implemented page navigation: the home page, product page, category page, blog, customer account and others. When the user picks a page, the iframe has to open it, the editor has to load the settings of its layout, and the next changes have to go to that page. Besides the standard pages, a store can have unique ones: if a merchant adds a banner to just one category, that category gets its own set of widgets. So the menu is built from the list of pages of that store, not from a fixed set.

### Widgets outside the page content stayed reachable without the sidebar

Some widgets appear only after a buyer’s action: for example, the pre-order form opens after the buyer clicks the "Pre-order" button on a product page. Such widgets aren’t visible on the page, and merchants used to manage them in the sidebar, so without it they would have been out of reach. I added a "Pop-up windows" section to the top menu: there these widgets can be found, added and set up in the same floating panel.

![The "Pop-up windows" section in the menu: the callback form, the pre-order form, notifications and other widgets outside the content](/images/work/visual-storefront/popup-windows-section.webp)

### A widget with an error can be fixed even if the page doesn’t load

Merchants and their developers add their own HTML, CSS, JavaScript and Liquid code to widgets. A critical error in that code can stop the store page from loading. In the old editor, the broken widget could still be found in the sidebar. In the new editor, the widget buttons appear inside the page, so if the page doesn’t load, the buttons aren’t there either: the user would lose access to exactly the widget that broke the page. They would have to look for it in another section of the admin panel or upload the template again, and the support team would have the same problem.

While the new editor wasn’t enabled for everyone, merchants still had a button that switched back to the old editor. It was the only way to remove a broken widget without workarounds, and it was going to disappear with the full rollout. So when the team decided in July 2024 to roll out the new editor, I suggested implementing recovery mode first and rolling out the editor after that. The team lead agreed.

In recovery mode (the interface calls it "Service mode"), the editor shows the page’s widgets grouped by page area: header, content, footer and widgets outside the content. From this list the user can open a widget’s code, fix it or remove the widget. Normally the editor finds widgets in the markup of the loaded page, but when the page fails to load, there is no markup, so the list comes from the server with a separate request. Recovery mode went to production on 31 July 2024, a day before the new editor rollout.

### Recovery mode works in Firefox too

Firefox had two separate problems. First, the editor didn’t learn that the page had failed. In Chrome, the editor sees right away that the expected content didn’t appear on the page, but in Firefox the iframe’s load event doesn’t fire in this case, so the editor can wait forever. I added a timeout: if the page doesn’t tell the editor it has loaded within 30 seconds, the editor opens recovery mode. I chose 30 seconds because the server limits a store page request to 25 seconds by default.

Second, the editor itself stopped responding. When the server couldn’t process the page in time, it returned the status code 408 Request Timeout. With that response, the editor in Firefox froze for 4 minutes on average, while in Chrome it was usable again after a few seconds. Firefox is known to resend a request after a 408 response: [Mozilla bug 907800](https://bugzilla.mozilla.org/show_bug.cgi?id=907800) describes the browser resending such a request about ten times over several minutes. Firefox 26 limited this behavior, but the browser still resends the request when the 408 arrives on a reused keep-alive connection. To keep the editor from freezing, we decided to change the status code.

Before changing it, I asked in the developers’ channel whether the change would break the integrations with Ozon and Wildberries, two Russian marketplaces. Those integrations also returned 408 in some cases. It turned out that 408 was used only in server request handlers and internal platform tasks, so the change didn’t break anything for stores. The new code had to be non-standard, so these responses would be easy to find in the logs. The first idea was 540, but Shopify already uses it, so we picked the unused code 555. After the change, Firefox stopped freezing.

### The updated recovery mode makes it easier to see which widget breaks a page

In November 2024 I shipped an updated version of recovery mode. Now, when a page doesn’t load, the editor first shows a "Site loading problems" window with an "Open the widget list" button. The list itself became a table that shows when each widget was added and changed and which widgets have edited code. This makes it easier to see which change made the page stop loading.

![Recovery mode as a table: widgets by page area with the Code changed, Tuned and Added columns, and an actions menu with Widget code, Widget settings and Remove widget](/images/work/visual-storefront/recovery-mode-widget-table.webp)

## Results

- The new editor was turned on for all stores on current templates on 1 August 2024. By September 2026, more than 90% of inSales stores used it; the old one remained only for templates made before 2020, and a few hundred users still worked in it.
- After the redesign, the share of new users who changed and saved a template or widget setting on their own in the first session grew from 60% to 80%.
- With the panels closed, the site preview on a 1920 px screen is about 17% wider.
- If a widget’s code breaks a page, the merchant or the support team finds and fixes that widget right in the editor, in Firefox too.
