---
title: Visual site editor redesign for inSales storefronts
description: "In the inSales visual site editor, merchants can change the design of their site and set up the widgets that show products and content. In the old editor, a static sidebar with settings and widgets was always open on the left side of the screen, so the interface was overloaded and the site itself got less space. I implemented the editor redesign, and I also proposed and built recovery mode, where a broken widget can be fixed or removed when an error in its code stops the page from loading."
locale: en
slug: visual-storefront
published: true
cover: /images/work/visual-storefront/floating-widget-settings.webp
coverAlt: "The new inSales visual site editor: the floating settings panel of a promo slider over the store page"
category: Browser editors
year: Apr 2024 – Nov 2024
context: inSales
role: "Implemented the editor redesign, proposed and built recovery mode, owned the rollout to all stores"
stack: [Vue.js, TypeScript, JavaScript, SCSS, Vuetify]
featured: false
order: 2
results:
  - value: "90%+"
    label: "of inSales stores use the new editor"
  - value: "60% → 80%"
    label: "new users who changed and saved a template or widget setting on their own in the first session"
  - value: "≈17%"
    label: "wider site preview on a 1920 px screen"
---

## The problem

On inSales, an e-commerce platform, a merchant changes the design of their site in the visual site editor. The editor lets them customize the template without editing any code: choose the color scheme and fonts, change the structure of the pages, and add, move, edit or remove widgets. A site template (the design of a store’s site) is made of widgets: they show products and content on the pages of the site. The store page opens in the editor inside an iframe, and the editor’s own interface sits on top of it.

Before the redesign, a static sidebar was always open on the left side of the screen. It showed the template settings, the widget lists for each page area (such as the header, content and footer) or the settings of the selected widget, depending on the level the merchant was on.

![The old editor before the redesign, with the Russian interface: a static sidebar with widget lists by page area on the left, the store page on the right](/images/work/visual-storefront/old-editor-static-sidebar-4th-generation.webp)

The old editor had three problems.

The first problem was duplication. A merchant could add, edit and remove widgets in two ways: in the sidebar, and with the buttons that appeared when they hovered over a widget right on the page. Because of this, it wasn’t clear which one to use. The editor needed one clear way to manage widgets.

The second problem was the narrow preview. The static sidebar took up part of the screen, so the merchant had less room to see their site.

The third problem was onboarding first-time users. An onboarding tour was hard to build for the old editor, because it would have had to jump between levels of the same sidebar: template settings, page areas, widget lists and the settings of one widget. A new user would struggle to follow what they were looking at and how these sections related to each other.

## My role

I implemented the redesign of the visual site editor from the designer’s mockups: the new top bar with the editor menu, the floating widget settings panel, the pages menu, the Pop-up windows section and onboarding for new users. Together with a backend developer, I changed the editor’s API, and I reworked how the editor loads data and works with the iframe. The main work took about 8 weeks.

Along the way I found cases the mockups didn’t cover. The most serious one was pages that fail to load because of an error in a widget’s code. For such pages I proposed and built recovery mode.

I also owned the rollout. In April 2024 I wrote up a plan to ship the new code in small parts behind a feature flag. While the flag was off, the new code didn’t affect the current editor, so it could go to production before all the features were ready. This way the QA engineer could check each small part more carefully, and if a bug showed up a few weeks later, the commit that caused it would be easier to find. On 24 June 2024 the new top bar was rolled out to new users. In July 2024 I was asked to roll out the new editor to all stores on the latest generation of templates and to remove the old editor from them. The new editor was turned on for all these stores on 1 August 2024.

## What I built

### Each part of the screen has a single purpose

I removed the static sidebar and split everything it held between three parts of the screen.

The template settings, the site data (the logo, contacts and other information about the store) and the pages menu are in the editor menu. It opens from the top bar and can be closed when it isn’t needed.

![The new editor: the editor menu with the pages menu is open, the store page is on the right](/images/work/visual-storefront/new-editor-top-menu-pages.webp)

The merchant manages widgets right on the page. When they hover over a widget, the editor buttons appear: Edit, Move, Remove and a button that replaces the widget with another one. Above and below the widget there are "+" buttons for adding a new widget. So there is now one way to manage widgets.

![The new editor: hovering over the promo slider shows the Edit button and the buttons for replacing, moving and removing the widget on its right, with the buttons for adding a widget above and below the slider](/images/work/visual-storefront/widget-hover-buttons.webp)

Clicking the Edit button opens a floating panel with the settings of that widget only: its content and design. I implemented the panel as a separate component and moved the rendering of widget settings into it. The panel can be placed on the left or on the right. The panel floats over the page without shifting it, and it closes when the merchant is done with the settings or starts scrolling the page.

![The floating settings panel of a promo slider over the store page](/images/work/visual-storefront/floating-widget-settings.webp)

If the merchant accidentally clicked a link inside the widget while the panel was open, the iframe would go to another page in the middle of editing. So while the panel is open, the iframe is covered by an overlay: a layer that catches clicks, so a click can’t open a link.

The editor menu and the settings panel are shown over the page and don’t take up space next to it. So the site preview on a 1920 px screen became about 17% wider, whether the menu and the panel are open or not.

### The editor menu has several levels, and the transitions between them are animated

The editor menu has several levels. For example, from the first level the merchant goes to Template settings, and from there to the catalog settings. When they click a menu item, the item moves smoothly to the top and becomes a heading with a back button, and the next level appears under it.

![The editor menu animation: the Template settings item moves up and becomes a heading, the list of template settings appears under it, then the catalog settings and the Pop-up windows section open the same way](/images/work/visual-storefront/editor-menu-levels.webp)

The tricky part was keeping the animation smooth in a nested menu. Testing showed that while the item was moving, its text overlapped the text of the other items, so I gave the moving item a background. The duration of the animation depends on the distance to the top edge of the menu: the lower the item is, the longer it takes to move up. The duration also has a minimum and a maximum value, so the animation is never too fast or too slow. I agreed on the animation speed with the designer and the QA engineer.

### Onboarding walks through the interface one part at a time

Once each part of the screen had a single purpose, I could build a step-by-step onboarding flow for the first visit. The editor calls it interactive training, and the merchant can start it again by clicking the question mark icon in the top bar. I built it with the existing `ui-tour` component from our ui-kit component library, which is built on Vuetify. First the tour shows the pages menu, the template settings and the top bar buttons, and then how to manage widgets on the page: editing a widget’s settings, replacing a widget and removing it. Each step points to its own part of the interface, so the merchant doesn’t have to watch sections replace each other inside one sidebar.

![The first onboarding step: a window titled Selecting the page to edit next to the pages menu](/images/work/visual-storefront/onboarding-page-selection-step.webp)

### Navigating to another page in the iframe updates the editor settings

I built the pages menu inside the editor menu. It lets the merchant switch between page types: home page, catalog (category pages), product page, blog, article, cart, customer account and others. Each page type has its own set of widgets. So when the merchant goes to another page, the editor has to keep several things in sync: open the chosen page in the iframe, find its widget set, load the settings for that set, and apply any later changes to that page.

By default, all pages of one type share one widget set. For example, if a catalog page has a site header widget, a catalog widget and a footer widget, every category page shows this set. If one page needs to be different, the merchant can create a separate widget set for it: for example, add a banner to one category page only. These unique sets also have to appear in the pages menu and open in the editor, so the menu is built from each store’s own list of pages, not from a fixed set of sections.

![The pages menu: in the Catalog section, besides the standard set called The default, there is a unique widget set for the Stock category, and this category is open in the editor](/images/work/visual-storefront/unique-category-page.webp)

### Pop-up windows are still accessible without the sidebar

Some widgets belong to the whole template, not to one page, and appear only after the buyer does something: the pre-order form, the callback request form, notifications, the window shown after a product is added to the cart. For example, the pre-order form opens after the buyer clicks the Pre-order button on a product page. Until then these widgets aren’t visible on the page, so they can’t be managed with the buttons that appear on hover. In the old editor the merchant managed them in the sidebar, and without the sidebar the merchant would have lost access to these widgets.

To keep these widgets accessible, I added the Pop-up windows section to the editor menu. It shows the list of these widgets. To add a new widget, the merchant clicks the Add widget button, and clicking a widget in the list opens its settings in the floating panel.

![The Pop-up windows section in the menu: the callback form, the pre-order form, notifications and other widgets that belong to the whole template](/images/work/visual-storefront/popup-windows-section.webp)

### The editor loads data in stages

When it opened, the old editor loaded everything the sidebar showed in one request: the template settings, the widget sets of all page types and the widget lists of each page area. The new interface has no sidebar, so there was no reason to fetch all of this in one request anymore. Together with the backend developer, I split the API to match the new interface. Now, when it opens, the editor requests only the template settings and the site data. When the store page has loaded in the iframe, the editor gets the data for this page with a separate request: the pages menu, the settings of the page’s widget set and the pop-up windows.

### A widget with an error can be fixed even if the page doesn’t load

Merchants and their developers can add their own HTML, CSS, JavaScript and Liquid template code to widgets. If this code has a critical error, the store page may not load. The mockups didn’t cover this case, and I ran into it while building the editor.

In the old editor this was fixable: the page didn’t work, but the broken widget was still in the sidebar, and the merchant could remove it or fix the error in its code. In the new editor the widget buttons appear inside the page, so if the page doesn’t load, the buttons aren’t there either. This means the merchant would lose access to the very widget that broke the page. They would have to look for this widget in another section of the admin panel, or download the template and upload it again. Our support team would have the same problem.

Until the new editor was turned on for all stores, store administrators had a temporary button to switch back to the old editor, and a broken widget could be removed there. But we planned to remove that button once the editor was rolled out to all stores. So when the rollout to all stores was approved on 9 July 2024, I proposed that we first build a widget list for pages that fail to load. Without that list a broken page would be harder to fix, and usually I was the one who fixed them. My manager agreed.

That is how recovery mode came about; in the interface it is called Service mode. When it opens, the editor checks whether the page has loaded. In the first version, if the page hadn’t loaded, the editor showed the recovery mode widget list right away, grouped by area: header, content, footer and pop-up windows. From this list the user could open a widget’s code and fix it, or remove the widget.

This list can’t be built from the page itself. Normally the editor finds widgets in the markup of the page loaded in the iframe, and a page that hasn’t loaded has no markup. So in recovery mode the editor gets the list of widgets from the server with a separate request.

Recovery mode went to production on 31 July 2024, a day before the new editor was turned on for all stores. Since then, if a merchant can’t tell which widget caused the error, they or a support engineer can open the page in the editor, find the broken widget in recovery mode, and then fix the error in its code or remove the widget. Recovery mode is also available on a page that has loaded: it can be opened from the page settings to see the full list of the page’s widgets.

### Status code 408, or why the editor froze in Firefox

Testing recovery mode in Firefox revealed a problem. When the server couldn’t process the page in time, it returned the 408 Request Timeout status code. With this response the editor in Firefox froze for 4 minutes on average, while in Chrome it was working again after a few seconds. Firefox is known to resend a request after a 408 response: [Mozilla bug report 907800](https://bugzilla.mozilla.org/show_bug.cgi?id=907800) describes the browser resending such a request about ten times over several minutes. Firefox 26 limited this behavior, but the browser still resends the request when the 408 response arrives on a reused keep-alive connection. To stop the editor from freezing, we decided to change the status code.

Before the change, I asked in the developers’ channel whether it would break our integrations with Ozon and Wildberries, two of the largest marketplaces in Russia. Those integrations also returned the 408 code in some cases. The discussion showed that the 408 code was used only in server request handlers and internal platform tasks, so the change wouldn’t break anything for stores. The new code had to be non-standard, so that these responses would be easy to find in the logs. We first considered 540, but Shopify already uses it, so we chose the unused code 555, and I prepared a merge request with the change. After that the editor in Firefox stopped freezing.

### The updated recovery mode makes the broken widget easier to find

The first version of recovery mode showed the widgets by page area with buttons for editing the code and removing the widget. To make the widget that breaks the page easier to find, I released an updated version on 5 November 2024.

This version changed how recovery mode opens. Before, if the page hadn’t loaded, the editor showed the recovery mode widget list right away. Now it first shows the Site loading problems window, which explains what happened and offers to open this list.

The recovery mode widget list became a table. The Added, Tuned and Code changed columns show when each widget was added to the page and when its settings and code were changed. These dates were added so that a support engineer or a developer could open a store with a broken page, open the widget list and see at once which widget’s code was edited last.

![Recovery mode as a table: widgets by page area with the Code changed, Tuned and Added columns, and an actions menu with Widget code, Widget settings and Remove widget](/images/work/visual-storefront/recovery-mode-widget-table.webp)

## Results

- The new editor was turned on for all stores on the latest generation of templates on 1 August 2024. More than 90% of inSales stores use it. The old editor remains only in stores on the previous generation of templates, which was created before 2020, and a few hundred users still work in it.
- After the redesign, the share of new users who changed and saved a template or widget setting on their own in the first session grew from 60% to 80%.
- The site preview on a 1920 px screen became about 17% wider.
- If a widget’s code breaks a page, the merchant or a support engineer can find and fix this widget right in the editor.
