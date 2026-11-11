---
title: Faster product loading and caching for storefronts
description: "I rebuilt how the inSales storefront JavaScript library loads and caches products. Product data requests fell by about 70%, and in typical measurements, pages with many product blocks loaded in 2–3 seconds instead of more than 5."
locale: en
slug: storefront-product-loading
published: true
cover: /images/work/storefront-product-loading/cache-validation-flow.svg
coverAlt: Diagram of the cache check. Liquid passes each product’s update time, the library compares it with IndexedDB and requests only changed products
category: Storefront platform
year: May 2023 – Mar 2024
context: inSales
role: "Library maintainer: AJAX components, client-side cache, rollout and docs"
stack: [JavaScript, IndexedDB, Liquid, AJAX]
featured: false
order: 6
results:
  - value: "≈70%"
    label: "fewer product data requests after the changes than before"
  - value: "2–3 s"
    label: "load time of pages with many product blocks instead of more than 5 s, in typical measurements"
  - value: "800+"
    label: "variants per product, and such products now show in widgets"
---
## The problem

inSales storefronts run on an in-house JavaScript library called CommonJS (not the module format) that loads product data and runs prices and the cart. In latest-generation templates, merchants build pages from widgets and can add several "Products from a category" blocks to the home page, which together show dozens or hundreds of products. Product loading had three problems:

1. The server built the cards of all these products right into the page HTML with Liquid, so the page was already heavy when it reached the browser, and then the library requested data for the same products again. Such pages took more than 5 seconds to load, sometimes about 15.
2. Product data was cached in the browser on a timer, usually 120 seconds. If a product changed earlier, the buyer could see old data, and if it didn’t change, the product was still requested again once the timer ran out.
3. Products with hundreds of variants, for example one model in dozens of sizes and colors, were loaded in full. A list of 20 such products could take 20–30 seconds or fail with a timeout, and then the widget didn’t load on the storefront at all.

## My role

I maintained the library and was responsible for the frontend side of this work: the AJAX components, cache rules, error handling, QA scenarios, the rollout plan and documentation for store developers. A backend developer added a light API response for product previews: I wrote the requirements, discussed them with him and adapted the library to the response.

## What I built

### Products load after the main page content

I built AJAX components that load and render products with separate requests after the main page content: the buyer sees the page right away, and the product blocks appear next. `ui-ajax-products` loads a list of products from a category for collections and sliders, and `ui-ajax-product` loads one product by ID, for example in the variant-picker modal window. A store developer defines the card markup with templates inside the widget, and after rendering, `ui-ajax-products` sends an event, so that, for example, a slider can start once it has products in it. Prices, variants and adding to the cart in AJAX-loaded cards go through the same product component as on the rest of the storefront, so these cards behave like regular ones.

Category pages were slowed down by the catalog filters: the server also built them together with the page, and in large catalogs they have hundreds of values. So I also built AJAX loading for filters, which gets their data after the page has loaded.

I wrote the documentation for `ui-ajax-products` and `ui-ajax-product` myself, and after it was published in May 2023, developers used it to move widgets to AJAX.

### Previews load without the full list of variants

In October 2023 a client came to us with a product that had 777 variants: to show it in a widget, the library requested it with all its variants. But a preview, the product card in a collection or slider, doesn’t need every variant: the price and whether the product can go straight into the cart are enough. So I wrote the requirements for a light API response and discussed them with the backend developer. With the `without_many_variants` parameter, the server returns a product without the full variant list, only a flag saying it has more than one variant. If a product has one variant, the button adds it to the cart right away; if it has several, the buyer goes to the product page or picks a variant in the modal.

The light data made caching harder. One product can be on the page at the same time in a preview, in another widget with full variant selection, in the modal and in the cart. If the light data overwrote the full data in the cache, the next widget would lose its variants, and if the cache were used without checking, the modal wouldn’t have enough data. So the library checks whether the cache has enough data for the place where the product is shown and loads the full data when needed.

In January 2024 a QA engineer tested the changes on 10 products with more than 800 variants each: with the old widgets, products from the category didn’t load at all, and with the new version they did. This test also found a second reason why product loading broke completely: when a product was added to the cart after the timer ran out, the library requested all products on the page again, and with heavy products that request timed out, and no product on the page initialized. On 30 January 2024 I shipped a fix: when adding to the cart, the library requests only the product being added.

### The cache checks a product’s update time instead of a timer

After the fix, adding to the cart requested only one product, but it still did so every time the timer ran out. And a timer can’t tell whether a product has changed. So I had the server pass each product’s update time to the page: it puts the time into the `data-product-updated-at` attribute through Liquid, and the library stores it together with the product data in IndexedDB, the browser database where CommonJS keeps its cache. On the next page load, the library compares the time in the markup with the stored one: products with a matching time come from the cache, and new and changed ones are requested again. Unchanged products stopped being reloaded just because 120 seconds had passed.

![Diagram of the cache check. Liquid passes each product’s update time, the library compares it with IndexedDB and requests only changed products](/images/work/storefront-product-loading/cache-validation-flow.svg)

Products that are in the cart but not shown on the current page needed their own rule. Before, after the timer ran out, the library requested them on every page, and with many variants that request failed. There is no need to keep requesting fresh data for a product that isn’t on the page, so the library uses the stored data for them, and if there is no record, it requests only the needed variants, because the cart shows the specific variant, not the whole product.

### Space for products is reserved before they load

Once product blocks loaded after the main content, there was a risk of layout shifts: if an empty block appears first and then cards and images go into it, everything below moves, and the buyer can click the wrong thing. Google counts such shifts in its page speed score. So the AJAX components request images in the sizes the layout needs, I discussed placeholders for widget images that reserve space for the picture in advance, and the loading indicator now hides only after the product has rendered.

### Old widgets keep working

The update time comes from the widget markup, and old and custom widgets don’t have this attribute. So the new cache couldn’t be turned on everywhere at once. First the new library version was released, keeping the old timer-based check for markup without an update time. Then `data-product-updated-at` was added to the widgets, and by March 2024 the attribute was in every system widget of latest-generation templates, except AJAX widgets, whose products the library also caches without a timer. In the QA scenarios I described moving between pages, changing a price in the admin, reopening a page after the old timer would have expired, a mix of light and full data, products only in the cart and products in several widgets at once.

## Results

- There were about 70% fewer product data requests, or roughly 3.3 times fewer, according to a comparison of request counts before and after the changes.
- In typical measurements, pages with many product blocks started loading in 2–3 seconds instead of more than 5.
- Products with more than 800 variants, which previously did not load in widgets at all, now load.
- I tested the changes on more than 10 standard templates and real merchant storefronts, including pages with about 60–200 products, and old templates kept working during the rollout.

The library itself, its build and the bundle-size work are in a [separate case about CommonJS](/work/commonjs-storefront-library/).
