---
title: Caching storefront products by update time instead of a timer
description: The inSales storefront library kept product data in the browser for a fixed time, so buyers could see old prices while unchanged products were requested again. Checking each product’s update time instead cut product data requests by about 70%.
locale: en
slug: cache-by-change-not-timer
published: true
date: '2026-10-21'
cover: /images/blog/cache-by-change-not-timer.svg
coverAlt: Decision table comparing a fixed cache time with a check of each product’s update time
category: Performance
readingMinutes: 8
tags: [Caching, IndexedDB, Storefront, Liquid, Performance]
---

inSales is an e-commerce platform with more than 60,000 online stores. On their storefronts, prices, product variants and adding to the cart run through CommonJS, the platform’s shared JavaScript library for storefronts. Despite the name, it has nothing to do with the CommonJS module format. I maintained it for several years.

To show a product’s price, variants and Buy button, the library requests the product data from the server and stores it in IndexedDB, the browser’s built-in database. In the latest generation of templates, merchants build pages from widgets and can put several "Products from a category" blocks on the home page, which together show dozens or hundreds of products. So the way the library caches products decides how many requests a page sends to the server.

## A timer can’t tell whether a product has changed

Product data used to stay in the cache for a fixed time: 120 seconds on most pages and 60 seconds on the product page. For merchants logged in to the admin panel, it was 3–4 seconds, so they could see a new price right after changing it. The checkout page didn’t cache product data at all.

Any fixed time caused two problems at once:

1. If a product had already changed, the buyer could see the old data until the time ran out.
2. If the product hadn’t changed, the library still requested it again once the time ran out.

## Products with hundreds of variants and an extra request when adding to the cart

A separate problem was products with hundreds of variants, such as one model in dozens of sizes and colors. In October 2023, a client came to us with a product that had 777 variants. To show it in a widget, the library requested its full data with every variant, and a list of 20 such products could take 20–30 seconds to load or fail with a timeout. But a preview, the product card in a collection or slider, doesn’t need every variant: the price and whether the product can go straight into the cart are enough. So I wrote the requirements for a light API response and agreed on them with the backend developer. With the `without_many_variants` parameter, the server returns a product without the full variant list, only a flag saying it has several variants.

In January 2024, a QA engineer tested these changes on 10 products with more than 800 variants each. The test found one more reason why product loading broke completely. If the cache time had already run out when a buyer added a product to the cart, the library requested every product it had saved when the page loaded. With heavy products, the server didn’t answer in time and returned a timeout error, and after that error no product on the page initialized. On 30 January 2024, I shipped a fix: when a product is added to the cart, the library requests only that product.

But even the request for one product was sent every time the cache time ran out. The problem was the timer itself: it can’t tell whether a product has changed. So at the end of January 2024, I started moving the cache to a check of each product’s update time.

## The update time comes with the page markup

Every product on the server has an update time, but it never reached the browser. I passed it through Liquid into the `data-product-updated-at` attribute of the product form:

```liquid
<form
  data-product-id="{{ product.id }}"
  data-product-updated-at="{{ product.updated_at }}"
>
  …
</form>
```

The library saves this value in IndexedDB together with the product data, in the `originalUpdatedAt` field. On the next page load, it compares the value in the markup with the saved one. If they match, the product hasn’t changed, and its data comes from the cache without a request. If they don’t, the library requests fresh data and updates the record. The cache stays in the browser: the server only has to put the update time into the markup, and it builds that markup from the Liquid template anyway.

## Fresh data isn’t always complete data

Comparing update times tells the library whether a product has changed. Once light responses appeared, that wasn’t enough, because different parts of a page need different amounts of data about the same product. One product can appear on a page in several places at once:

- in a preview without variant selection;
- in another widget with full variant selection;
- in a modal window where the buyer picks a variant;
- in the cart.

If a light response overwrites full data in the cache, the next widget loses its variants. And if any cached record counts as good enough, the modal window doesn’t get enough data to show the variants. So the library checks a record for two things: whether it is up to date and whether it has enough data for this place on the page. If the data isn’t enough, the library loads the full product.

All the rules fit in one table:

| Product state | What the library does |
|---|---|
| In the cache, same update time, enough data | Takes the data from the cache without a request |
| Not in the cache | Requests the product and saves it |
| Update time has changed | Requests fresh data and updates the record |
| The widget needs variants the cache doesn’t have | Loads the full data |
| An old template doesn’t pass the update time | Checks the record by time, as before |

Simplified, the decision for one product looks like this:

```js
/**
 * Decides what to do with one product on page load.
 * cached: the IndexedDB record, or undefined;
 * updatedAt: the value of data-product-updated-at,
 *   missing in old templates;
 * needsVariants: whether this place on the page
 *   needs the full variant list.
 */
function resolveProduct({ cached, updatedAt, needsVariants }) {
  const requestType = needsVariants ? 'request-full' : 'request-light'
  if (!cached) return requestType

  // Old templates don't pass the update time,
  // so they keep the time-based check
  const isFresh = updatedAt
    ? cached.originalUpdatedAt === updatedAt
    : !isExpired(cached)
  const isComplete = !needsVariants || cached.hasAllVariants

  return isFresh && isComplete ? 'cache' : requestType
}
```

The function returns one of three decisions: take the product from the cache, request the light data for a preview, or request the full data with all variants. A cached record is used only when it is both up to date and complete for this place. So the same product can get different decisions on one page: the preview takes the light record from the cache, and the modal window loads the variants. In the example, the `isExpired` function stands for the old time check, and the `hasAllVariants` field marks a record with the full variant list.

## Cart products without extra requests

Products that are in the cart but not shown on the current page needed their own rule. Before, after the cache time ran out, the library requested them on every page, and if such a product had many variants, the request failed. Yet there is no need to keep requesting fresh data for a product that isn’t on the page.

So the library uses the saved data for these products. If there is no record in the cache, it requests only the needed variants through `products_with_variants.json`, because the cart shows the specific variant the buyer chose, not the whole product.

## Old templates kept working

Thousands of stores use the library, and many of them run old templates or custom code. Their markup doesn’t have the `data-product-updated-at` attribute, so the new library version couldn’t require it. The rollout had two stages. First, we released a library version that kept the old time check for markup without an update time: that’s the last row of the table. So stores didn’t have to update their templates at the same time as the library. Then the attribute was added to the built-in widgets, and by March 2024 it was in every built-in widget of the latest template generation except AJAX widgets. The library also caches products from AJAX widgets without a timer, the same way as products with the attribute.

Every store gets a CommonJS update at once, so I prepared the QA test cases with both old and new templates in mind. For the product cache, I described moving between pages, changing a price in the admin panel and opening the page again, opening a page after the old cache time would have run out, and a mix of light and full data. Products in the cart and products shown in several widgets at once were tested separately.

## About 70% fewer product data requests

A comparison of product data requests before and after the change showed about 70% fewer of them: where ten requests used to go out, about three go out now. Unchanged products stopped being requested again just because 120 seconds had passed.

I also moved product loading to after the main page content, as described in the [storefront product loading case](/work/storefront-product-loading/). Together, these two changes helped pages with many product blocks the most. In typical measurements, they started loading in 2–3 seconds instead of more than 5. I checked this on more than 10 standard templates and on real client pages, including pages with about 60–200 products.

## What you can apply to your own cache

If your cache keeps data for a fixed time, ask yourself what you really need to know. Usually it isn’t how many seconds have passed, but whether the data has changed since you saved it. If the server knows an update time or a version of the data, send it to the client with the markup or the response. Then you don’t have to choose between old data and extra requests.

If different parts of a page need different amounts of data about one record, check not only whether the record is up to date, but also whether it has enough data for that place.

If other people change the markup your code runs in, first release a version that understands the new attribute and works without it, and only then add the attribute to the markup.
