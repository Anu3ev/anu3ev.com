---
title: Replacing a cache timer with "has this product changed?"
description: A storefront library cached product data for a fixed time, so pages either showed stale data or re-requested products that hadn't changed. Comparing each product's update timestamp cut product-data requests by about 70%.
locale: en
slug: cache-by-change-not-timer
published: true
date: '2026-10-21'
cover: /images/blog/cache-by-change-not-timer.svg
coverAlt: Decision table comparing a time-based cache expiry with a check of each product's update timestamp
category: Performance
readingMinutes: 7
tags: [Caching, IndexedDB, Storefront, Liquid, Performance]
---

Put a few product collections on a store's home page and you can easily get 60 to 200 products on one screen. Each of them needs data in the browser: prices, variants, stock, and what happens when a customer clicks "Add to cart". On inSales, an e-commerce platform with 60,000+ merchants, that work is done by CommonJS, the JavaScript library behind the storefronts. I maintained it for several years.

When I started digging into its caching, product data in the browser lived on a timer: two minutes in the common case, less on product pages, a few seconds in admin mode. It's the most ordinary cache there is, and it failed in two opposite directions at once:

1. If a product had changed, the customer could keep seeing old data until the timer ran out.
2. If nothing had changed, the timer still expired, and the library downloaded the same data again.

So the cache was too long and too short at the same time. There was also a less obvious cost. After a customer added one item to the cart, the library checked the whole product list it had saved when the page loaded. If the timer had expired by then, one click could re-request data for every product on the page, not just the one the customer touched.

## Asking a different question

A timer answers "how old is this data?". The storefront doesn't really care about age. It needs to know "is this still the same product?". The server already had the answer, because every product has an update timestamp. It just never reached the browser.

So I passed it through the template. The Liquid markup puts the timestamp on each product element:

```liquid
<div
  data-product-id="{{ product.id }}"
  data-product-updated-at="{{ product.updated_at }}"
>
```

The library stores that value in IndexedDB next to the product data. On the next page load it compares the value from the markup with the one it saved. It's a client-side cache: the server only provides the timestamp to compare against.

The decision for each product became a small table:

| Product state | What the library does |
|---|---|
| In the cache, same timestamp, enough data for this widget | Reuse it without a request |
| Not in the cache | Fetch and store it |
| Timestamp changed | Fetch fresh data and update the record |
| This widget needs variants the cache doesn't have | Fetch the full product |
| Old template without the timestamp | Keep the old time-based check |

Simplified, the rule fits in one function:

```js
/** Decides where one product's data comes from on page load. */
function resolveProductSource({ cached, updatedAt, needsVariants }) {
  if (!cached) return 'fetch'

  // Templates that don't pass the timestamp keep the previous timer behaviour
  if (!updatedAt) return isExpired(cached) ? 'fetch' : 'cache'

  if (cached.updatedAt !== updatedAt) return 'refresh'
  if (needsVariants && !cached.hasAllVariants) return 'fetch-full'

  return 'cache'
}
```

The cart got its own rule. Products that are in the cart but not on the current page no longer trigger a reload of everything visible. Cart-only products reuse their cached data, and if there's nothing cached, the library requests just the variants it needs. Products that are also on the page go through the normal timestamp check.

## The hard part: fresh isn't the same as complete

The timestamp turned out to be the easy half. The harder question was what "the cached product" even means when different parts of a page want different amounts of it.

Some large stores have products with 500 to 1,000 variants. A request for a list of 20 such products could take 20–30 seconds and end in a timeout, while a preview in a slider didn't need the variant list at all. I wrote up the requirements for a lighter API response for previews, agreed them with the backend team and adapted the library to it. A preview now only learns that a product has several variants and offers to open the product card or a modal. A product with a single variant can still go straight to the cart.

After that, the same product could sit in one shared cache while being shown in several places:

- a preview without variant selection;
- another widget with a full variant selector;
- a modal where the customer picks a variant;
- the cart.

Both naive rules break something. If a light response overwrites a full record, the next widget loses the variants it needs. If any cached record counts as good enough, the modal opens with half the data. So freshness alone wasn't enough. The cache rules had to take into account what each place on the page actually needs: a lighter response must not remove variants another widget relies on, and a widget that needs more than the record holds asks for the rest. That's the fourth row of the table.

Even "fresh" turned out to have more than one dimension. After stock changes, the cache could keep the old order of variants, and a preview showed the price of the first variant even though it was no longer in stock. I worked on updating the variant data and its position in the stored list, not just the timestamp.

## Rolling it out to templates I don't control

The library runs inside templates that merchants and their developers customize. A new version that suddenly required `data-product-updated-at` would have broken every customized template without it.

So the rollout had two stages. First, a library version that understood the timestamp and kept the old timer for markup without it, which is the last row of the table. Then the attribute was added to the widgets' markup. No store ever needed both changes to arrive at the same moment.

The QA scenarios followed the same table: moving between pages, changing a price in the admin and reopening the page, reopening after the old timer would have expired, mixing full and reduced variant data, products in the cart, and the same product in several widgets.

## What changed

When I compared the number of product-data requests before and after the change, there were about 70% fewer of them, roughly 3.3 times fewer. Unchanged products stopped reloading just because two minutes had passed.

Together with moving product blocks to AJAX rendering after the main page content, product-heavy pages got noticeably faster. In representative measurements they went from over 5 seconds to 2–3 seconds. I checked more than 10 standard templates and real client pages, including pages with about 60–200 products. That's a representative result, and a particular store can differ: it depends on the number of widgets, the device, the network and the cache state. Unusually heavy pages could previously approach 15 seconds.

## After the release

Production found things QA didn't, and two of those bugs were the same lesson in different clothes.

In December 2024 a product stopped initializing on mobile Safari after a customer moved from the catalog to the product card. It looked like storage hanging on the product page. Step-by-step reproduction showed the problem started earlier: "Load more" in the catalog initialized each loaded product separately, and each run prepared the list again and went back to IndexedDB. The client's page had two catalog widgets, which doubled the repeated work. I switched to batch initialization, so the loaded products are processed together instead of scanning storage once per card.

In May 2025 an error response for part of the products crashed initialization of the whole library. Even the products whose data had loaded fine stopped working. I changed the error handling so successfully loaded products still initialize.

A shared cache spreads one product's data across the whole page. Work that runs per item and failures that happen per item need to stay per item, or one card takes the page down with it.

## If your cache runs on a timer

Ask what you actually need to know. Usually it isn't the age of the data. It's whether the source has changed since you stored it. If the server already has an update timestamp or a version, getting it to the client is often cheaper than tuning TTLs, because you stop trading stale data against wasted requests.

Before you ship, ask a second question: can two consumers want different shapes of the same record? If they can, completeness belongs in the cache rules next to freshness, and the lighter response must never quietly win.

And if you don't control every place that renders your markup, ship the reader before the writer: a version that understands the new signal and still works without it.

The full project is in the [storefront product loading case](/work/storefront-product-loading/).
