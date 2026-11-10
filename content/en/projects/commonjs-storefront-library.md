---
title: Maintaining the JavaScript library behind every inSales storefront
description: "CommonJS runs product pages, carts and forms on inSales storefronts, and when I took it over, the library was effectively abandoned. I reduced the requests that got large stores blocked, shrank the compressed bundle from 300+ KB to 168 KB and kept developing it for years."
locale: en
slug: commonjs-storefront-library
published: true
cover: /images/work/commonjs-storefront-library/library-modules-and-templates.svg
coverAlt: Diagram of the CommonJS library with its public API and components, connected to standard templates, widgets, custom store code and developer docs
category: Storefront platform
year: Oct 2021 – Sep 2026
context: inSales
role: "Library maintainer: refactoring, build, components, public API, docs"
stack: [JavaScript, Webpack, IndexedDB, Liquid, jQuery, Lodash, GitLab]
featured: false
order: 7
results:
  - value: "300+ KB → 168 KB"
    label: "compressed production bundle after the build and dependency rework"
---

## The problem

The main JavaScript library of inSales storefronts is called CommonJS, also Common.js and `common.v2.js` in the docs. Its name is the same as the CommonJS module format, but they are different things. The library runs product pages, variant selection, prices, the cart and forms. Its public API is used not only by platform widgets but also by code that merchants, partners and third-party developers wrote for their stores.

When I started working on the library in 2021, the project was effectively abandoned: it worked, but nobody wanted to study how it was built or make serious changes. And it had two problems:

1. It sent extra requests for product data, and because of them the platform’s DDoS protection blocked large stores.
2. The compressed bundle that every storefront loads weighed more than 300 KB.

Changing the library was risky: the platform has more than 60,000 stores, many run on old templates or custom code, and a method that looks unused may be used in one of them.

## My role

It was one of my first big tasks after I moved from technical support to frontend development. I became the library’s maintainer and stayed in that role for several years: I studied the architecture, reworked the build setup, added components and public APIs, wrote documentation, prepared QA scenarios and releases, and fixed bugs in live stores. Backend developers built the server APIs, and I agreed on the data format with them.

In GitLab I had the Maintainer role in the CommonJS repository: I reviewed colleagues’ merge requests and explained how to build a test version of the library and ship a release. When colleagues needed to understand how the library worked, they were sent to me.

## What I built

### First a map of the connections, then changes

Before changing anything, I had to understand where product data comes from, when it gets cached, what triggers rendering, how cart events lead to new requests and which modules depend on each other. There were no AI assistants at work yet, so I read the code and drew a map of the project in Miro by hand. The map showed which other parts a change to one method would affect.

![Diagram of the CommonJS library with its public API and components, connected to standard templates, widgets, custom store code and developer docs](/images/work/commonjs-storefront-library/library-modules-and-templates.svg)

### The requests that got large stores blocked

In 2022, large stores started getting blocked by the platform’s DDoS protection. It blocks an IP address that sends too many requests in a short time. A large store has about 10 managers processing orders at the same time, usually from one office and therefore one IP address, and their combined requests were enough for the protection to treat them as an attack. Those requests came from CommonJS: to show the price, variants and the Buy button, the library requests data for the products on the page, 25 at a time.

In January 2022 I organized a meeting about this problem and wrote a summary for the product team in Confluence. One option was to stop sending requests and put product data right into the page markup. I tested it on a page with 100 products: without the data in the markup it loaded in 0.8–1 s on average, and with it, in 1.5–2.5 s, because the markup became too heavy. So I suggested putting only single-variant products in the markup and loading the rest with requests, as before.

While investigating, I found a case where the library requested data it already had. CommonJS keeps product data in the browser for 120 seconds, but for a merchant signed in to the admin panel only for 3–4 seconds, so they see a new price right after changing it. Store managers work from the admin panel, so for them the cached data expired constantly. When it did, clicking Buy on a page with 28 products requested data for all 28, although the library had already loaded it when the page opened. I suggested reusing the data already loaded.

In September 2022 the blocks happened again at a large store, and I used that store to investigate. First I checked the checkout page, which managers use all the time: I put 500 products in the cart, the cart maximum. 20 requests of 25 products each would have been enough for 500 products, but the page sent 80, because every request went out 4 times. This happened only for users signed in to the store admin panel, which is exactly the store’s managers.

The question was whether this page really caused the blocks. The nginx logs showed that it caused no spikes in all of August. The blocks came from category pages: one of them sent 107 requests in 1 second, covering about 2,675 different products. A category page shows at most 100 products, so some other code on the page was passing that many product IDs to the library, and that code could be different in every store.

So I protected the library itself instead of looking for that code in every store. All product list requests go through the `getList` method, and I made two changes in it. The list of IDs is now capped at 500, which doesn’t affect normal use, because a cart holds at most 500 products and a page shows at most 100. And if the same products are requested again, the library returns the data it already loaded instead of sending a request to the server. Store code calls `getList` jQuery-style, with `done` and `fail` methods that a regular promise doesn’t have, so when the data is already loaded, `getList` still returns an object with `done` and `fail`. I shipped the changes in September 2022, and on 26 September I checked the logs: product data requests had dropped significantly, even more than we expected.

### Every storefront loads less code

CommonJS sent server requests through jQuery, although browsers already have native `fetch`, and dropping jQuery completely was one of the goals. In February 2022 I moved the requests for product comparison, favorites and the `ajaxAPI` methods from jQuery to native `fetch`. Both the library and store code get data through the `ajaxAPI` methods. Store developers called them with `done` and `fail`, so the methods now return a promise that has both `then` and `catch` and the familiar `done` and `fail`, and store code kept working.

Then I upgraded the build to Webpack 5, and in May 2023 I moved all of the library’s modules from CommonJS `require` to ES `import`/`export`: 152 files and about 9,000 lines. The bundler can see which code is used only with ES modules, and then tree shaking drops the rest. I also set up code splitting and removed unused dependencies, and instead of the whole of Lodash the library now imports only the methods it needs. As a result, the compressed production bundle shrank from more than 300 KB to 168 KB, more than 44% smaller, and the uncompressed one from about 900 to 600 KB. Product selection, the cart and forms kept working as before.

But CommonJS also made Lodash available to template code, and old and custom templates could rely on it. Removing Lodash for all stores at once wasn’t possible, so I added a `without_lodash` template flag in the platform’s Rails backend. New installations of latest-generation templates get it turned on, and for other templates the server adds Lodash to the page as a separate file from a CDN, so store code kept working.

### One-click orders got an independent cart

The one-click order form and the request form, a form for sending a request, for example for a service, shared one mechanism, so the settings of one affected the other. First, in December 2023, I separated the request form from the one-click order, so it is sent without a product and doesn’t change the buyer’s cart.

The second problem was the one-click order itself. It worked through the buyer’s regular cart: the product was added to it, and the whole cart went into the order. If the buyer had already put other products there, they ended up in the order too, and analytics systems got, at best, general product data, and at worst whatever was in the cart at that moment. So in 2024 a backend developer and I made an independent cart for one-click orders. They added a separate `/quick_checkout` endpoint, and CommonJS chooses where to send the form. On 9 October 2024 I wrote them a spec for the response, which includes the ordered product for analytics.

Old templates weren’t affected: only the new library version chooses the new endpoint, so with an older version or without the library the form is sent the old way. To be safe, I asked QA to check older template generations too. The release had to go in a specific order, backend first and then the library, and I shipped the new CommonJS version on 25 October 2024.

### Bugs that appeared only in live stores

CommonJS runs in thousands of stores with different templates and widgets, so some bugs appear only with a particular combination of them.

**In mobile Safari, the product page didn’t work after the catalog.** In December 2024, after going from the catalog (a category page) to a product page, the product didn’t initialize, so variant selection and the Buy button didn’t work. At first it looked like IndexedDB, the browser database where the library keeps product data, was hanging. Reproducing it step by step showed that the problem started earlier: when the buyer clicked Load more in the catalog, the library initialized each product separately and went to IndexedDB again every time. I made initialization run in batches, so loaded products are processed together. I found the cause on 3 December and shipped the fix the next day.

**One failed request broke every product on the page.** The library gets product data with several requests. If the server didn’t answer one of them in time, the whole library failed to initialize, and even products whose data had arrived didn’t work. In May 2025 I changed how the library handles a failed request, and now products with received data work even if some requests failed.

### New storefront features are built on the library’s API

The library’s components connect to Liquid templates through `data-*` attributes, and with `Products`, `Cart`, `ajaxAPI` and `EventBus` store developers get data, change the cart and react to events. On top of this I added [AJAX loading of products and filters with a cache based on product update time](/work/storefront-product-loading/), [product options and add-ons](/work/product-options/), [multi-warehouse carts](/work/multi-warehouse-carts/) for wholesale stores and an [invisible captcha](/work/form-protection/) for standard and custom forms. In 2026 I added a hook before the contact form is assembled and a parameter that lets the button opening the form pass its own data into the message.

![Product page on the Stories template with size buttons, price and the in-cart counter](/images/work/commonjs-storefront-library/stories-product-in-cart-counter.webp)

I wrote the [documentation for store developers](https://docs.liquidhub.ru/common.v2.js/1readme/) for my work myself: which markup and `data-*` attributes to add, which settings a component takes, which events start an action and which report that it finished, with examples. After I published the AJAX products documentation in May 2023, developers used it to move widgets to AJAX. For the team, I separately described how to build a test version of CommonJS and connect it to a store to check changes before a release.

### Every release was checked on old templates

A CommonJS update reaches every store at the same time, so each version had to work with several template generations and with store code nobody can see in advance. I kept the old ways of connecting components, built test versions of the library, connected them to test stores, sent changes to review and QA and shipped them in stages, and put large changes behind feature flags.

## Results

- After the changes in `getList`, far fewer product data requests reached the server, and these were the requests that got large stores blocked.
- The compressed production bundle shrank from more than 300 KB to 168 KB and the uncompressed one from about 900 to 600 KB, while old and custom templates still get Lodash.
- The abandoned library got a maintainer and documentation, and in 2026 new APIs were still being added to it.
- New storefront features are built on it: AJAX product loading with a cache based on update time, product options, multi-warehouse carts, one-click orders with an independent cart and captcha in forms.
