---
title: Maintaining the JavaScript library behind inSales storefronts
description: "CommonJS runs product pages, carts and forms on inSales storefronts. In 2021 I took over this effectively abandoned library, cut the requests that got large stores blocked, shrank the compressed bundle from 300+ KB to 168 KB and kept developing it for years."
locale: en
slug: commonjs-storefront-library
published: true
cover: /images/work/commonjs-storefront-library/library-modules-and-templates.svg
coverAlt: Diagram of the CommonJS library with its public API and components, connected to standard templates, widgets, custom store code and developer docs
category: Storefront platform
year: 2021–2026
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

Storefronts on inSales, an e-commerce platform with more than 60,000 online stores, load a JavaScript library called CommonJS (Common.js or `common.v2.js` in the docs). It shares its name with the CommonJS module format, but they are different things. The library runs product pages, variant selection, prices, the cart and forms. Its public API is used not only by platform widgets but also by code that merchants, partners and third-party developers wrote for their stores.

When I started working on the library in 2021, the project was effectively abandoned: it worked, but nobody wanted to study how it was built or make serious changes. Changing the library was risky. Many stores run on old templates or custom code, and a method that looks unused may be used in one of them.

I had to solve three problems in the library:

1. It sent extra requests for product data, and in 2022 the platform’s DDoS protection started blocking large stores because of them.
2. The compressed bundle that every storefront loads weighed more than 300 KB.
3. Pages with many products took more than 5 seconds to load. How I made them faster is described in [a separate case study](/work/storefront-product-loading/).

## My role

It was one of my first serious tasks after I moved from technical support to frontend development. I became the library’s maintainer and stayed in that role for several years: I added features and fixed bugs that appeared in merchants’ stores. Backend developers built the server APIs, and I agreed on the data format with them.

In GitLab I had the Maintainer role in the CommonJS repository: I reviewed colleagues’ merge requests and explained how to ship a release. I was responsible for CommonJS, so colleagues and the support team came to me with questions about how the library worked. I explained how the API behaved and helped find where a bug came from: the library, the data, the server response or the store’s own code.

## What I built

### First a map of the connections, then changes

Any bug in CommonJS could break product selection or the cart on many merchants’ sites at once. So first I had to understand how everything worked: where product data comes from, when it gets cached, what triggers rendering, how cart events lead to new requests and which parts of the code depend on each other. I wasn’t using AI assistants yet, so I read the code and drew a map of the project in Miro by hand. The map showed which parts of the code a change to one method would affect.

![Simplified map of the areas I investigated: product data and where it comes from, the client-side cache and when data is reused or refreshed, rendering and how widgets receive product data, cart events and which actions trigger updates](/images/work/commonjs-storefront-library/codebase-map-areas.webp)

### The requests that got large stores blocked

In 2022, large stores started getting blocked by the platform’s DDoS protection. It blocks an IP address that sends too many requests in a short time. A large store has about 10 employees processing orders at the same time, usually from one office and one IP address. Their combined requests were enough for the protection to treat them as an attack and block the address.

Those requests came from CommonJS. To show the price, variants and the Buy button, the library requests data for all products on the page from the server, 25 products at a time. The more products the pages show and the more often these employees open them, the more requests leave their IP address.

In January 2022 I started looking for ways to reduce these requests. I organized a meeting about the problem and wrote a summary for the product team in Confluence. One option we discussed was to stop sending requests and put product data right into the page’s HTML. I tested it on a page with 100 products: without the data in the HTML, the page loaded in 800–1000 ms on average, and with it, in 1500–2500 ms, because the HTML became too heavy. So this option didn’t work.

While investigating, I found a case where the library requested data it already had. CommonJS keeps product data in the browser for 120 seconds, but for a user signed in to the admin panel, only for 3–4 seconds, so they see a new price right after changing it. Store staff work while signed in to the admin panel, so for them the data expired constantly. When it did, after a click on the Buy button the library requested data for every product on the page: on a page with 28 products, it sent a request for all 28 to add one product to the cart, although it had already loaded them when the page opened. I fixed this later, in January 2024: now the library requests only the product being added to the cart.

In September 2022 the blocks happened again at a large store, and I used that store to investigate. I checked the checkout page first: the store’s employees work with orders all the time, and on this page product data isn’t stored in the browser and is requested every time the page opens. To test the worst case, I put 500 products in the cart, the cart maximum. For 500 products, 20 requests of 25 would have been enough, but the page sent 80: every request went out 4 times. This happened only for a user signed in to the admin panel, that is, the store’s staff.

The question was whether this page really caused the blocks. I found the blocks themselves in the server logs in Kibana, but the address of the page that sent a request is recorded only in the nginx logs. The nginx logs showed no spikes of requests from the checkout page at any point in August. The blocks came from catalog pages: one of them sent 107 requests of 25 products in 1 second, 2,675 products in total. A catalog page shows at most 100 products, so some other code on the page was passing that long list to the library, and that code could be different in every store.

So I protected the library itself instead of looking for that code in every store. All product list requests go through the `getList` method, and I made two changes in it. First, the list of product IDs is now capped at 500. This doesn’t affect normal use, because a cart holds at most 500 products and a page shows at most 100. Second, if the same products are requested again, the library doesn’t send a request to the server and returns the data it already loaded. So identical requests that used to go out several times no longer reach the server.

Store code calls `getList` with `done` and `fail`, as in jQuery. So when the data is already loaded, the method still returns it in an object with `done` and `fail`, and that code works as before.

I released the changes for testing in September 2022, and on 26 September the server logs showed far fewer product data requests, even fewer than we expected.

### Storefronts load less code

The second problem was the amount of code every storefront loads. CommonJS sent server requests through jQuery, although browsers already have native `fetch`. In February 2022 I moved the requests for product comparison, favorites and the `ajaxAPI` methods from jQuery to native `fetch`. Both the library and store code get data from the server through the `ajaxAPI` methods. This was the first step toward dropping jQuery.

The hard part was store code. Store developers called the `ajaxAPI` methods jQuery-style, with `done` and `fail`. A regular promise doesn’t have these methods, only `then` and `catch`, so a simple replacement would have broken that code in every store that had it. To prevent this, I made the methods return a promise that has both `then` and `catch` and the familiar `done` and `fail`.

The build was another place to cut code. I upgraded it to Webpack 5 and removed unused dependencies.

CommonJS used to include the whole of Lodash, although it used only some of its methods, and all of Lodash went into the file every storefront loads. Only with ES modules can the bundler tell which code is used, and then tree shaking drops the rest. So in May 2023 I moved all of the library’s modules from CommonJS `require` to ES `import`/`export` and started importing only the Lodash methods the library needs. The change touched every module: 152 files and about 9,000 lines.

As a result, the compressed production bundle shrank from more than 300 KB to 168 KB, more than 44% smaller, and the uncompressed one from about 900 to 600 KB. After each change I checked that product selection, the cart and forms worked as before.

![Build changes and their result: ES modules instead of CommonJS imports, Webpack 5 with tree shaking and code splitting, fewer dependencies; the compressed production bundle went from over 300 KB to 168 KB](/images/work/commonjs-storefront-library/bundle-300-to-168-kb.webp)

But CommonJS also made Lodash available to template code, and old and custom templates could rely on it. In latest-generation templates, only one widget used Lodash, and I removed Lodash from that widget. We couldn’t stop serving Lodash to all stores at once, because some stores’ own code would break. So I added a `without_lodash` template flag to the platform’s Rails backend. New installations of latest-generation templates have the flag turned on, and for other templates the backend adds Lodash as a separate file from a CDN. Stores on old and custom templates kept working with Lodash, and new stores load the storefront without the full Lodash library.

### One-click orders got an independent cart

Stores use the quick order form in three scenarios: a one-click order for a product, an inquiry without a product (for example, for a service), and an order from the buyer’s cart. All three worked through one mechanism, so the settings of one form affected another.

First, in December 2023 and January 2024, I separated inquiries from one-click orders. A one-click order always required a product: its ID had to be passed to the button, but an inquiry about a service has no product. I added a `data-quick-checkout="fake_order"` mode, in which the inquiry form is sent without a product and doesn’t change the buyer’s cart.

The second problem was the one-click order itself. It worked through the buyer’s regular cart: the product was added to it, and the whole cart went into the order. If the buyer had already put other products there, they ended up in the order too. Analytics systems also got, at best, general product data, and at worst whatever was in the cart at that moment.

So in September and October 2024 a backend developer and I made an independent cart for one-click orders. The backend developer added a separate `/quick_checkout` endpoint, and CommonJS chooses where to send the form. A data attribute on the form tells the library whether the independent cart is turned on in the one-click order settings. If it is, the product isn’t added to the regular cart, and the form goes to the new endpoint. Otherwise CommonJS sends it to the old `/orders/create_with_quick_checkout.json`.

So that analytics get exactly the ordered product, I specified the response format: it includes the variant ID, name, price and quantity of the ordered product. CommonJS passes this data to analytics systems. In October 2024 the independent cart became the default: now a one-click order contains only the product the form was sent for. The old behavior stayed available as a separate setting marked as legacy. Old templates weren’t affected. They load an older CommonJS version or work without the library, and only the new version chooses the new endpoint, so in old templates the form is sent the old way. To be safe, I asked QA to check older template generations too.

### Bugs that appeared only in live stores

CommonJS runs in thousands of stores with different templates, widgets and settings, so some bugs appear only with a particular combination of them.

**In mobile Safari, a product page opened from the catalog didn’t work.** In December 2024 I investigated this bug: when a buyer opened a product page from the catalog, variant selection and the Buy button didn’t work, because the library didn’t initialize the product. At first it looked like IndexedDB, the browser database where CommonJS keeps product data, was hanging on the product page itself. Reproducing it step by step showed that the problem started earlier. When the buyer clicked the Load more button on a catalog page, the library initialized each loaded product separately, and every run went to IndexedDB again. Now the library initializes loaded products in one batch and doesn’t go to IndexedDB for each product separately. I shipped the fix the day after I found the cause.

**One failed request broke every product on the page.** CommonJS gets product data with several requests. If the server didn’t answer one of them in time, the whole library failed to initialize, and even products whose data had arrived didn’t work. In May 2025 I changed how the library handles such a response. Now products with received data initialize even if some requests failed.

### New storefront features are built on the library’s API

The library’s components connect through `data-*` attributes to Liquid templates, which the server uses to build store pages. Store code works with the library through `Products`, `Cart`, `ajaxAPI` and the `EventBus` event bus: it gets data, changes the cart and reacts to events. On this API I built [AJAX loading of products and filters with a cache based on product update time](/work/storefront-product-loading/), [product options and add-ons](/work/product-options/) and [multi-warehouse carts](/work/multi-warehouse-carts/) for wholesale stores, and I connected an [invisible captcha](/work/form-protection/) to standard and custom forms.

In 2026 I extended the API for custom forms. First I added a hook that runs before the contact form is assembled: a store developer can use it to prepare the form’s own content before it is sent. Then I added a `payload` parameter, through which the button that opens the form passes its own data into the message, for example, which block of the page the buyer wrote from.

I documented my work for store developers myself ([CommonJS documentation](https://docs.liquidhub.ru/common.v2.js/1readme/), in Russian). It explains which markup and `data-*` attributes to add, which settings a component takes, and which events start an action and which report that it finished, with examples. In May 2023 I published the documentation for AJAX product loading, and developers used it to move widgets to AJAX.

### Changes were checked on old and new templates

Every new CommonJS version had to work with several template generations and with store code that can’t be checked in advance. So I wrote test cases for QA that covered old and new templates and different combinations of widgets. I kept the old ways of connecting components working, built test versions of the library and connected them to test stores. Changes went through review and QA, and I shipped them in stages. I put large changes, such as the choice of captcha provider, behind feature flags.

For example, the Newtone and Stories templates look different, but in both of them size selection and the Add to cart button use the same library API. So one API change affects both templates and has to be checked in each of them.

![Purchase blocks on product pages: Newtone (left) and Stories (right), each with a name, price, size selection and the Add to cart button in its own design](/images/work/commonjs-storefront-library/newtone-stories-product-forms.webp)

## Results

- After the changes in `getList`, there were far fewer of the product data requests that got large stores blocked.
- The compressed production bundle shrank from more than 300 KB to 168 KB and the uncompressed one from about 900 to 600 KB, while old and custom templates still get Lodash.
- A one-click order contains only the product the form was sent for, and analytics systems get the data of that product.
- The abandoned library got a maintainer, and its new APIs got documentation.
