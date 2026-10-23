---
title: Maintaining the JavaScript library behind every inSales storefront
description: I took over CommonJS, the neglected library that runs product pages, carts and forms on inSales storefronts. I cut its compressed bundle from over 300 KB to 168 KB and kept extending it for several years.
locale: en
slug: commonjs-storefront-library
published: true
cover: /images/work/commonjs-storefront-library/library-modules-and-templates.svg
coverAlt: Diagram of the CommonJS library with its public API and components, connected to standard templates, widgets, custom store code and developer docs
category: Storefront platform
year: Oct 2021 – Sep 2026
context: inSales
role: "Library maintainer: refactoring, build, components, public API, docs"
stack: [JavaScript, Web Performance, Webpack, Code Refactoring, AJAX, IndexedDB, Web Caching, Technical Documentation, Debugging, E-Commerce]
featured: false
order: 6
results:
  - value: "300+ KB → 168 KB"
    label: "compressed production bundle after the build and dependency rework"
---

## The problem

CommonJS (also called Common.js or `common.v2.js`) is the JavaScript library on inSales storefronts. It loads product data, switches variants, updates prices, changes cart quantities and submits customer forms. Store developers connect it to their templates through `data-*` attributes and call its public API from their own code. inSales is an e-commerce SaaS platform with 60,000+ merchants, so a bug in this library could break product selection or the cart on many stores at once.

I picked it up soon after I moved from support engineering to frontend in 2021. The library was effectively abandoned: it still worked, but the bundle was heavy, the build was outdated, and nobody wanted to make serious changes because nobody knew which templates and custom integrations depended on which part.

## My role

I became the library's maintainer and stayed in that role for several years. I mapped the architecture, reworked the build, added components and public APIs, wrote developer documentation, prepared QA scenarios and releases, and fixed issues on live stores. Server APIs belonged to backend developers; I agreed data requirements with them.

## What I built

### A dependency map before the first big change

Before changing anything, I had to understand the code. AI assistants weren't part of my workflow yet, so I read it and drew a map in Miro by hand: where product data comes from, when it reaches the cache, what starts rendering, how cart events lead to new requests and which modules depend on each other. With that map I could see what a change in one method would affect outside it.

### A smaller build with the same behavior

I moved the build to Webpack 5 and converted the modules from CommonJS `require` to ES `import`/`export`; the library kept its old name. ES modules let the bundler see what is actually used, so tree shaking could drop dead code, and code splitting broke the build into parts. I replaced bulky Lodash imports with the specific modules the library needed and removed unused dependencies. The compressed production bundle went from over 300 KB to 168 KB and the uncompressed file from about 900 KB to about 600 KB. Product selection, cart operations and forms kept working.

### A public API that store developers can build on

The library connects Liquid templates, HTML markup and store data. Components attach through `data-*` attributes, and `Products`, `Cart`, `ajaxAPI` and `EventBus` give developers data, cart operations and events. On top of that I added AJAX loading for product lists, single products and catalog filters with a new product cache ([separate case](/work/storefront-product-loading/)), [product options and add-ons](/work/product-options/) in the product card and cart, [multi-warehouse carts](/work/multi-warehouse-carts/) for B2B stores and [invisible CAPTCHA](/work/form-protection/) for standard and custom forms. Smaller additions came from real requests: a hook before the feedback form is assembled (January 2026) and a `payload` passed from the button that opens a form (July 2026). For cart integrations I used the light events `add_items:insales:cart:light` and `update_items:insales:cart:light`: they fire earlier, but carry cart lines without the nested `product` object, so handlers had to be written for that shape.

![Product page on the Stories template with size buttons, price and the in-cart counter](/images/work/commonjs-storefront-library/stories-product-in-cart-counter.webp)
*A standard template (Stories). Variant buttons, price and the in-cart counter run on CommonJS.*

### Compatibility as a release rule

Every new version had to work with several generations of templates and with custom store code I couldn't see in advance. I kept old ways of connecting components working and checked a shared component everywhere it appears on the storefront. I built test versions of the library, connected them to test stores, sent changes to review and QA and released them in stages. For larger changes, such as choosing the CAPTCHA provider, I used feature flags. When an empty `captcha_type` turned up on real accounts after a release, I traced the cause, fixed how the setting was handled and prepared a second rollout of the system forms.

### Documentation and support

I wrote developer documentation for `ui-ajax-products`, `ui-ajax-product` and the reCAPTCHA and Yandex SmartCaptcha APIs: which markup and `data-*` attributes to add, which settings a component accepts, how display templates work, which events start an action and which report that it has finished, with integration examples. I also described how to connect a test build to a store before a general update. When something broke on a client's site, I helped colleagues work out whether the cause was the library, the data, the server response or the store's own code.

## Results

- The compressed production bundle went from over 300 KB to 168 KB; the uncompressed file from about 900 KB to about 600 KB.
- A library nobody wanted to touch got an active maintainer, documented components and public APIs, and was still getting new APIs in 2026.
- New storefront features were built on it: AJAX product loading with a timestamp-based cache, product options, multi-warehouse carts and CAPTCHA for forms.
- Older templates and custom integrations kept working through staged releases.
