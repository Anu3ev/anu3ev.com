---
title: Faster product loading and caching for storefronts
description: "I rebuilt how the inSales storefront JavaScript library loads and caches products. Products now load after the main page content, and the cache checks a product’s update time instead of a fixed period. In typical measurements, heavy pages load in 2–3 s instead of more than 5."
locale: en
slug: storefront-product-loading
published: true
cover: /images/work/storefront-product-loading/cache-validation-flow.svg
coverAlt: "Diagram of the cache check: the Liquid template outputs each product’s update time, and the library compares it with the record in IndexedDB and requests only new and changed products"
category: Storefront platform
year: May 2023 – Mar 2024
context: inSales
role: "Library maintainer: AJAX components, client-side cache, rollout and docs"
stack: [JavaScript, IndexedDB, Liquid, AJAX]
featured: false
order: 6
results:
  - value: "≈70%"
    label: "fewer product data requests after the switch to update-time checks"
  - value: "2–3 s"
    label: "load time of pages with many product blocks, down from more than 5 s in typical measurements"
  - value: "800+"
    label: "variants in each of 10 products that didn’t load in a widget before and load now"
---
## The problem

inSales is an e-commerce SaaS platform with more than 60,000 online stores. inSales storefronts run on CommonJS, inSales’s in-house storefront JavaScript library (the name matches the CommonJS module format, but they are different things). It loads product data, shows prices and runs the cart.

In latest-generation templates, a store owner builds pages from widgets. The owner can add several "Products from a category" blocks to the home page. Together they can show dozens or hundreds of product previews, each with a price and an Add to cart button. Loading these pages had three problems:

1. The server rendered the previews of all these products right into the page HTML with Liquid. So the page took a long time to build on the server and was heavy when it reached the browser. Then the library requested data for the same products again to show prices, variants and the Add to cart button. These pages took more than 5 seconds to load, sometimes about 15.
2. The library cached product data in the browser for a fixed period, 120 seconds on most pages. If a product changed before the period ran out, the buyer could see old data. If it didn’t change, the library still requested it again once the period ran out.
3. The library requested products with hundreds of variants, for example one model in dozens of sizes and colors, with all their variants. A request for 20 such products could take 20–30 seconds or fail with a timeout error, and then the widget didn’t load on the storefront at all.

## My role

I was the library’s maintainer and owned the frontend side of this work: the AJAX components, cache rules, error handling, test cases for QA, the rollout plan and documentation for store developers. A backend developer built the light API response for products with hundreds of variants.

## What I built

### Products load after the main page content

To stop the page from waiting while the server rendered every preview, I developed AJAX components. They load and render products with separate requests after the main page content. In these widgets the server no longer renders previews into the HTML, so the page arrives light. The buyer sees it right away, and the product blocks appear next. If a product’s data is already in the cache, the library takes it from there and requests only the missing products.

There are two components. `ui-ajax-products` loads a list of products from a category for collections and sliders. `ui-ajax-product` loads one product by ID, for example in the modal window where the buyer picks a variant before adding the product to the cart. A store developer defines the preview markup with templates inside the widget, so the store can keep its own design. After rendering, `ui-ajax-products` sends an event, and a slider, for example, can start once it has products in it.

Prices, variant selection and adding to the cart in AJAX-loaded products go through the shared product component of CommonJS. So these previews behave the same as on the rest of the storefront. I tested the components on more than 10 standard templates and on real client pages, including pages with about 60–200 products.

Category pages were slow too, because the server built the catalog filters together with the page, and in large catalogs filters have hundreds of values. So I developed a component that loads filters with AJAX: it requests their data separately, after the main page content.

I wrote the documentation for [`ui-ajax-products`](https://www.insales.ru/collection/ajax-tovary/product/ui-ajax-products) and [`ui-ajax-product`](https://www.insales.ru/collection/ajax-tovary/product/ui-ajax-product) (in Russian) myself. After it was published in May 2023, developers used it to move widgets to AJAX.

### Previews load without the full variant list

The third problem was products with hundreds of variants. In October 2023 a client came to us with a product that had 777 variants: to show it in a widget, the library requested it with every variant. But a preview doesn’t need every variant. The price and whether the product can go straight into the cart are enough.

So I asked the backend developer for a light API response and agreed on its format with him. With the `without_many_variants` parameter, the server returns a product without the full variant list, only with a flag saying that it has more than one variant. I adapted the library to the new response: it sends this parameter for products whose widget markup has the `data-product-without-many-variants` attribute. If a product has one variant, the Add to cart button adds it right away. If it has several, the buyer goes to the product page or picks a variant in the modal window.

The light data made caching harder. One product can be on the page in several places at once: in a preview, in another widget with variant selection, in the modal window and in the cart. If the light response overwrote the full data in the cache, the next widget would lose its variants. And if the library used the cache without checking it, the modal window wouldn’t get enough data. So a light response keeps the variants already in the cache, and if a place needs more data than the cache has, the library loads the full data.

![Diagram: a preview in a collection needs the price and a flag for several variants, while a widget or modal window with variant selection needs every variant. The library checks whether the cache has enough data: if it does, the product comes from the cache; if variants are missing, it loads the full data](/images/work/storefront-product-loading/light-and-full-product-data.svg)

### Adding to the cart requests only the added product

Full variant lists weren’t the only reason why product loading broke completely. A second reason came up while the light responses were being tested. On page load, the library saved a list of every product on the page. Once the cache period ran out, the library requested every product on that list again whenever a product was added to the cart. Previews in category widgets also sent this request every time they initialized.

For products with hundreds of variants, this request didn’t finish in time, and the server returned a timeout error. The library initialized products only when it got every product it had requested, so this one error stopped every product on the page from working. On 30 January 2024 I shipped a fix: adding to the cart now requests only the product being added, and previews no longer send a request when they initialize.

![Diagram before and after the fix. Before: an Add to cart click or a preview initializing makes the library request every product on the page, the request fails with a timeout error for products with hundreds of variants, and no product initializes. After 30 January 2024: only the added product is requested, and the products on the page initialize](/images/work/storefront-product-loading/cart-request-before-after.svg)

In January 2024 a QA engineer tested the changes on 10 products with more than 800 variants each. With the old widgets, products from the category didn’t load at all. With the new version, they did.

### The cache checks a product’s update time instead of a fixed period

After the fix, adding to the cart requested only one product, but it still did so every time the cache period ran out. And a fixed period told the library nothing about whether a product had changed.

So I built a check based on each product’s real update time. I set up Liquid to output this time in the `data-product-updated-at` attribute. The library saves it with the product data in IndexedDB, the browser database where CommonJS keeps its cache. On the next page load, the library compares the time in the markup with the saved one. Products with a matching time come from the cache, and new and changed products are requested again. Products that haven’t changed are no longer requested just because 120 seconds have passed.

![Diagram of the cache check: the Liquid template outputs each product’s update time, and the library compares it with the record in IndexedDB. If the time matches and there is enough data, the product comes from the cache with no request. If the product is new or changed, or data is missing, the library requests it and updates the record](/images/work/storefront-product-loading/cache-validation-flow.svg)

Products that are in the cart but not shown on the current page needed their own rule. Before, once the cache period ran out, the library requested them on every page load, and for products with many variants that request failed. There is no need to keep requesting fresh data for a product that isn’t on the page. So for these products the library uses the saved data. If there is no record in the cache, it requests only the needed variants, not the whole product, because the cart shows the specific variant the buyer added.

### The loader stays until products are rendered

Once product blocks loaded after the main content, there was a risk of layout shifts. If an empty block appears first and previews and images are inserted later, everything below it moves, and the buyer can click the wrong thing. Google counts these shifts in its page speed score as CLS (Cumulative Layout Shift). So loading and rendering had to match the space that product blocks take on the page. I set up the AJAX components to prepare images in the sizes the layout needs, and I made the loader hide only after the products have rendered. When the loader disappears, the buyer sees finished previews right away.

### Old widgets keep working

The update time comes from the widget markup, and old and custom widgets don’t have this attribute. So the update-time check couldn’t be turned on everywhere at once, and I split the rollout into two stages. First, the new library version was released. For markup without an update time, it kept the old check based on the cache period. At this stage we checked that nothing broke in latest-generation templates or in older ones.

Then I added `data-product-updated-at` to the built-in widgets. At the second stage we checked that products still came from the cache after 120 seconds. We also checked that after a price change in the admin panel, the library requested only that product. By March 2024 the attribute was in the built-in widgets of latest-generation templates.

## Results

- After the switch to update-time checks, there were about 70% fewer product data requests, or roughly 3.3 times fewer.
- In typical measurements, pages with many product blocks loaded in 2–3 seconds instead of more than 5.
- Products with more than 800 variants, which didn’t load at all with the old widgets, now load.
- Old and custom widgets kept working during the rollout.

The library itself, its build and the bundle-size work are in a [separate case about CommonJS](/work/commonjs-storefront-library/).
