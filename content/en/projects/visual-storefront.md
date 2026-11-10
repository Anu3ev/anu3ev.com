---
title: Visual site editor redesign for inSales storefronts
description: "In the inSales visual site editor, a permanent sidebar duplicated the widget controls and took up part of the screen. I built the frontend of the redesign, used by 90%+ of stores, and recovery mode, which lets merchants reach a widget whose code stops the page from loading."
locale: en
slug: visual-storefront
published: true
cover: /images/work/visual-storefront/floating-widget-settings.webp
coverAlt: Redesigned inSales visual editor with a floating settings panel for the selected promo slider over a full-width storefront preview
category: Browser editors
year: Apr 2024 – Nov 2024
context: inSales
role: "Sole frontend developer of the redesign; ran the rollout and built recovery mode"
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

Merchants on inSales change their storefront’s design and set up widgets, the blocks that make up storefront pages, in the visual site editor. It is one of the platform’s main tools. The storefront page opens in an iframe inside the admin, and the editor around it controls the page’s widgets and settings.

Before the redesign, a large sidebar was always open next to the iframe. It held the design settings, the lists of widgets for each area of the page and the settings of the selected widget, all at once. This caused three problems:

1. Widgets could be added, edited and removed both from the sidebar and with buttons right on the page, so there was no clear main way to work with them.
2. The sidebar took up part of the screen, so merchants saw their storefront in a smaller area.
3. An onboarding tour for new users would have had to switch between levels of the same sidebar, and a new user would struggle to understand what they were being shown.

![The old editor with a permanent sidebar of design settings and page sections next to the storefront](/images/work/visual-storefront/old-editor-permanent-sidebar.webp)

*Before: global settings, page sections and widget lists shared one panel that never closed.*

## My role

A designer made the mockup, and my task was to build the frontend of the redesign. I was the only frontend developer, and the main work took about 8 weeks. Besides the new interface, it covered changing the API contract together with the backend developer, a new way of loading data, and a new way for the editor and the iframe to communicate. During the work, we found scenarios the mockup didn’t cover. For the most serious one, pages that don’t load because of a widget’s code, I suggested and built recovery mode.

I also ran the rollout. First I described how to ship the changes in parts behind a feature flag: while the flag is off, the new code doesn’t affect the current editor, QA can check small parts, and if a bug shows up later, the commit that caused it is easier to find. In July 2024 I was asked to roll out the new editor to all stores and remove the old one, and I wrote the announcement for the support team.

## What I built

### Each part of the screen has one job

I removed the permanent sidebar. The global design settings and the page navigation moved to the top menu. Widget actions happen right on the page, and the Edit button opens a floating panel with the settings of that widget only. I built the panel as a separate component and moved the rendering of widget settings into it. The panel can be placed on the left or right, and it appears over the storefront without moving it. When the user finishes with the settings or starts scrolling the page, the panel hides.

![Redesigned inSales visual editor with a floating settings panel for the selected promo slider over a full-width storefront preview](/images/work/visual-storefront/floating-widget-settings.webp)

Because the settings panel now opened over the page, a user could accidentally click a link inside the widget, and the iframe would navigate away in the middle of editing. So while the panel is open, an overlay covers the iframe and catches the clicks.

Without the permanent sidebar, the storefront preview on a 1920 px screen is about 17% wider with the panels closed.

### The onboarding tour shows the interface one part at a time

Once each part of the screen had one job, the onboarding tour could be built step by step. First it introduces the template settings and the top menu buttons, then it shows how to manage widgets on the page: edit their settings, replace them and remove them. Each step points to a separate part of the interface that stays the same during the step. After the redesign, the share of new users who changed a template or widget setting on their own in the first session and saved it grew from 60% to 80%.

### Data loads when the interface needs it

When a merchant opened the old editor, it loaded the design, the layouts (sets of widgets for one page type) and all widget lists in one request, because the sidebar showed them all at once. Together with the backend developer, we split the API to match the new interface: on opening, the editor requests only the data for the top menu, and widget lists are requested when the user opens them. The first response was already only about 5–10 KB, so this didn’t make anything faster. The goal was different: the API stopped returning data for a sidebar that no longer existed.

### Switching pages keeps the editor and the storefront preview in sync

I built the navigation between page types in the top menu: the home page, product page, category page, blog, customer account and others. When the user picks a page, the iframe must load it, the editor must find its layout and load the layout’s settings, and the next changes must go to that page. Besides the standard pages, a merchant can create a unique page with its own set and order of widgets, for example, one category page with its own banner. Such pages also had to appear in the menu and open correctly, so the navigation couldn’t be a fixed list. I connected the page choice in the menu with the iframe navigation and the loading of the layout settings, and the menu shows both standard and unique pages.

### Widgets outside the page content stayed reachable without the sidebar

Some widgets appear only after a buyer’s action: for example, the pre-order form opens after the buyer clicks Pre-order on a product page. These widgets aren’t visible on the page, and merchants managed them in the sidebar, so without it there would have been nowhere to manage them. I added a Pop-ups section to the top menu: there these widgets can be found, added and set up, and clicking one opens the same floating settings panel.

### A widget with an error can be fixed even if the page doesn’t load

Merchants and their developers add custom HTML, CSS, JavaScript and Liquid (the template language) code to widgets. A critical error in that code can stop the page from loading. In the old editor, the broken widget could still be found in the sidebar. After the redesign, widgets were managed with buttons inside the iframe, and if the page didn’t load, those buttons weren’t there either: the user lost access to exactly the widget that broke the page. Without a separate solution, they would have had to look for the widget in another section of the admin or upload the template again, and the support team would have had the same problem.

While the new editor wasn’t enabled for everyone, store admins still had a button that switched back to the old editor. It was the only way to remove a broken widget without workarounds, and the button was due to disappear with the full rollout. When the team decided in July 2024 to roll out the editor to all stores, I suggested building the widget list for broken pages first and rolling out the editor after that: without it, such pages would be harder to fix, and fixing them was usually my job. The team lead agreed.

This became recovery mode. If the page doesn’t load, the editor opens a list of that page’s widgets with their names and IDs, grouped by page area, and the user can open a widget’s code, fix it or remove the widget. The list can’t be built from the page itself: when the page fails, the iframe has no markup where the editor usually finds the widgets. So in recovery mode the list comes from the server with a separate request. On a page that loaded normally, recovery mode can also be opened to see all its widgets.

![List of page widgets grouped by page area, with widget code, widget settings and remove actions](/images/work/visual-storefront/recovery-mode-widget-list.webp)

### In Firefox, a 30-second timeout marks a page as broken

In Chrome, the iframe with a broken page gets an error right away, and the editor opens the widget list. In Firefox, the iframe’s load event doesn’t fire in this case, so the editor could wait forever. I added a timeout: if the page hasn’t reported that it’s ready within 30 seconds, the editor shows the widget list. I chose 30 seconds because the server handler for store requests limits processing to 25 seconds by default, and other handlers, except the marketplace integrations, stay within 30 seconds.

The response status code caused a second problem in Firefox. On a timeout, the server returned the page with status 408, and with that response the editor in Firefox froze for 4 minutes on average, while in Chrome it was usable again after a few seconds. Before changing the status code, I asked in the developers’ channel whether it would affect the integrations with Ozon and Wildberries, two Russian marketplaces, which in some cases also returned 408. The discussion showed that 408 was used only in server handlers and internal platform tasks, so the change didn’t break anything for stores. The new status code had to be non-standard, so these responses would be easy to find in the logs. The first idea was 540, but Shopify already uses it, so we picked the unused code 555. After the change, the Firefox freeze was gone.

### Recovery mode shipped a day before the editor rollout

Before the release, I made the list stop showing widgets that were added but not saved: they aren’t on the storefront and disappear after a page reload. For the recovery mode tooltip, the first idea was to mention error 555, but I argued that users don’t know what that error is, so we left the code out of the tooltip. Recovery mode went to production on 31 July 2024, a day before the new editor was rolled out to all stores. In November I shipped an updated version that makes it easier for merchants and the support team to find the widget that breaks a page. A broken page first shows a "Site loading problems" window, and the widget list became a table that shows when each widget was added and changed, and marks widgets whose code was edited.

## Results

- The new editor was rolled out to all stores on 1 August 2024. More than 90% of inSales stores use it; the old one remains only for previous-generation templates made before 2020, and a few hundred users still work in it.
- The share of new users who changed a template or widget setting on their own in the first session and saved it grew from 60% to 80%.
- With the panels closed, the storefront preview on a 1920 px screen is about 17% wider.
- If a widget’s code breaks a page, the merchant or the support team finds and fixes that widget right in the editor, in Firefox too.
