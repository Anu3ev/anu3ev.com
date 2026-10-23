---
title: Faster product loading and caching for storefronts
description: I rebuilt how the inSales storefront library loads and caches products. Product-data requests fell by about 70%, and product-heavy pages loaded in 2–3 seconds instead of over 5.
locale: en
slug: storefront-product-loading
published: true
cover: /images/work/storefront-product-loading/cache-validation-flow.svg
coverAlt: Diagram of the cache check. Liquid passes each product's update time, the library compares it with IndexedDB and requests only changed products
category: Storefront platform
year: Dec 2024 – May 2025
context: inSales
role: "Library maintainer: AJAX components, client-side cache, rollout and docs"
stack: [JavaScript, IndexedDB, Web Performance, AJAX, Web Caching, Debugging, API Integration, Technical Documentation, Cross-browser Compatibility, Liquid]
featured: false
order: 6
results:
  - value: "≈70%"
    label: "fewer product-data requests in a before/after comparison of request counts"
  - value: "2–3 s"
    label: "load time of product-heavy pages that took over 5 s, in representative measurements"
  - value: "10+"
    label: "standard templates checked, plus real client pages"
---

## The problem

inSales storefronts run on CommonJS, a shared JavaScript library that loads product data, updates prices and handles the cart. Merchants can put several product collections on one page, so a home page might carry 60–200 products. Liquid rendered these blocks before the page was delivered, and then the library requested product data for them again in the browser.

The cache made it worse. Product data usually lived for 120 seconds (60 on product pages). When the timer expired, unchanged products were downloaded again; when a product changed before that, the shopper could still see old data. Adding one item to the cart re-checked the page's whole product list, so a single click after expiry could trigger requests for products the shopper never touched.

## My role

I maintained the library and owned this work on the frontend: AJAX components, cache rules, error handling, QA scenarios, the rollout plan and developer documentation. Backend developers built the lighter API responses; I wrote down what previews needed and integrated the result. I checked the changes on more than 10 standard templates and on real client pages.

## What I built

### AJAX components for products and filters

Product blocks no longer had to be rendered by Liquid up front. I built `ui-ajax-products` for category lists and sliders, `ui-ajax-product` for loading one product by ID (for example, in a modal where the shopper picks a variant) and an AJAX loader for catalog filters. Store developers define card markup with templates inside the widget. The components emit events such as `init-products:ui-ajax-products` after rendering, so a slider starts only when its content exists. Prices, variants and add-to-cart go through the same product component as the rest of the storefront, so AJAX cards behave like regular ones.

![The ui-ajax-products page in the inSales developer documentation](/images/work/storefront-product-loading/ui-ajax-products-docs.webp)
*Public documentation I wrote for `ui-ajax-products` (in Russian, like the rest of the inSales docs).*

### Update timestamps instead of a fixed timer

A timer can't tell whether a product changed. I passed each product's update time through Liquid into `data-product-updated-at` and stored it with the cached record in IndexedDB as `originalUpdatedAt`. On the next page load, the library reuses products whose timestamps match and requests only new or changed ones. Products that are in the cart but not on the page come from saved data, or from `products_with_variants.json` if there is no record, instead of refreshing the whole visible list. The cache lives in the browser; the server only supplies timestamps.

### Light previews without losing full variant data

Some large stores have products with 500–1,000 variants, and a list of 20 such products could take 20–30 seconds or time out. A slider preview doesn't need every variant, so I moved previews to a lighter response (`without_many_variants`) and kept full data where the shopper chooses a variant. That created a cache conflict: one product can appear in a preview, a full selector, a modal and the cart. If a light response overwrote a full record, the next widget lost its variants. If the cache was trusted blindly, the modal got too little data. I added completeness rules: each place states what data it needs, and missing details are fetched on demand.

### Failures that only showed up on live stores

On mobile Safari, product pages sometimes didn't initialize after "Load more" in the catalog. It looked like storage hanging on the product page, but step-by-step reproduction showed that every loaded item started its own initialization and scanned storage again. I switched to initializing loaded products in one batch. In another case, one product request returning HTTP 555 broke initialization for every product, including those that had loaded fine. I changed error handling so successful products still initialize. I also kept the loader visible until rendering finished, prepared images for their target sizes and discussed image placeholders with partners to reduce layout shifts.

### A two-stage rollout

Stores run different template generations and custom code, so the new cache couldn't switch on everywhere at once. First, the new library version shipped and kept the old time-based check for markup without timestamps. Then `data-product-updated-at` was added to the widgets. My QA scenarios covered page transitions, price changes in the admin, revisiting a page after the old TTL, mixed light and full data, cart-only products and products shown in several widgets.

## Results

- Product-data requests fell by about 70% in a before/after comparison of request counts.
- In representative measurements, product-heavy pages loaded in 2–3 seconds instead of over 5 seconds. The effect depends on the number of widgets, the device, the network and the cache state.
- I checked the changes on 10+ standard templates and real client pages, including pages with roughly 60–200 products.
- Older templates kept working through the rollout, and store developers got documentation for the new components.

The library itself, its build and the bundle-size work are in a [separate case about CommonJS](/work/commonjs-storefront-library/).
