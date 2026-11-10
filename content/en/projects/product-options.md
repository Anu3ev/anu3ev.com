---
title: Product options and extras on the storefront product page and cart
description: "I added product options to the inSales storefront product page and cart: the selection component, price recalculation and cart operations. The same variant with different extras becomes separate cart lines, and each line reaches checkout with its own options."
locale: en
slug: product-options
published: true
cover: /images/work/product-options/product-page-gift-box-and-card.webp
coverAlt: Demo-store product page for a bouquet with Classic size, gift box and greeting card selected and the price updated to $48
category: Storefront platform
year: Oct 2023 – Jan 2024
context: inSales
role: "Frontend in the storefront library: ui-accessories, price recalculation, cart API, rollout, docs"
stack: [JavaScript, Liquid, AJAX]
featured: false
order: 10
---

## The problem

Merchants wanted to sell extras and services with a product: gift packaging, a greeting card, a ribbon. Some options are required and some optional, and each group has its own limits. Buyers need to see the final price before they add the product to the cart.

The hardest part was the cart. CommonJS, the storefront JavaScript library inSales wrote itself, treated a cart line as a product variant, for example a bouquet size. With options that’s no longer true: a Classic bouquet in standard wrapping and the same bouquet in a gift box with a card are two different cart lines with different prices. Code that found a cart line by variant ID could change or delete the wrong line, and the counters on the product page and the stock check could show the wrong numbers.

## My role

I built the storefront side in CommonJS: the `ui-accessories` component, price recalculation, cart operations, showing options in the cart and at checkout, the rollout and documentation for store developers. A backend developer built the server side of options, and we agreed on the data format between the storefront and the server together. The work ran from October to December 2023, alongside [multi-warehouse carts](/work/multi-warehouse-carts/).

## What I built

### Options render in any widget, and errors show under each group

`ui-accessories` connects through `data-accessories="{{ product.id }}"` and renders option groups from HTML templates in the page markup, so it works both in standard widgets and in a store’s own design. Each group has a minimum and maximum number of values. In the demo store, the buyer must choose exactly one type of wrapping and can add up to two extras. I made the rendering work from data attributes instead of tying it to the product page, because options are also needed in products loaded onto the page with a separate request and in product previews on category pages, where a product can also be added to the cart.

The maximum can be enforced by disabling extra checkboxes, but a buyer can’t be forced to choose a value, so when too few values are chosen, the server returns an error. We first discussed showing it in a pop-up notification, but if a product has many options and none are chosen, the notification could cover the whole screen. So I showed the error as text under each option group, and when values are missing, the page scrolls to the first group with an error.

### The price depends on the variant and the options

The price is recalculated when the buyer changes the variant or the set of options. In the demo store, a gift box (+$5) and a card (+$3) raise the Classic bouquet from $40 to $48, and the same extras raise the Grand size from $60 to $68. The price code had to treat 0 as a real price, not as "no price": a variant can cost 0, and standard wrapping adds $0.

![Demo-store product page for a bouquet with Classic size, gift box and greeting card selected and the price updated to $48](/images/work/product-options/product-page-gift-box-and-card.webp)

### A cart line combines the variant and its options

The backend developer suggested two data formats: a new `accessoriable_variant_ids` structure that lists, for each variant, the cart lines with the IDs of the chosen options, or the format another cart method already used. I chose the first: it’s easier to handle on the server, and it goes in the same cart request as the existing variant list. On the day we agreed on the format, we found that Rails, the server framework, doesn’t parse an array of IDs in request parameters, so we started sending option IDs as an object with each option’s quantity. This also leaves room to choose an option more than once later.

I updated `Cart.add`, `Cart.set`, `Cart.delete` and the cart task queue to send the chosen options together with the variant ID. Quantity changes and deletion now apply to one specific combination, not to every line with that variant. In the cart widget, each line shows the names of its chosen options.

I tested every backend build on staging and found bugs before the release: for example, a product without options was added to the same cart line as the same product with options.

![Cart with the same bouquet variant as two lines: standard wrap, and gift box with greeting card](/images/work/product-options/cart-same-variant-two-lines.webp)

### The counter follows the cart line, and stock is counted per variant

The counter on the product page and the "Add to cart" button show the quantity of the selected cart line. If the buyer switches from standard wrapping to the gift box, the counter shows the quantity of the gift-box line, and after the standard-wrapping line is deleted, the "Add to cart" button appears again even though the gift-box line is still in the cart. Stock, on the other hand, belongs to the variant: lines with different options are still units of the same product, so their quantities are added up for the check. I went through the places where a cart line was found by variant ID and separated the line counter from the variant stock in each of them.

![Cart with 7 standard and 9 gift units of one variant and a maximum quantity warning](/images/work/product-options/cart-combined-quantity-limit.webp)

### Lines with options reach checkout

In December 2023 I noticed that three lines of one product with different options reached the checkout page as a single line. The cart form sent only variant IDs and quantities to checkout, without the options. These fields couldn’t be dropped, because quantity changes, deletion and price recalculation in CommonJS and in every cart widget depend on them. So when the buyer clicks "Checkout", the library checks whether the form has options, adds fields for them and numbers each cart line. I didn’t add these fields directly to the widget code, because the numbers in the markup and in JavaScript could get out of sync.

### Options were turned on gradually, behind a feature flag

I wrote a test checklist: adding, changing the quantity and deleting regular products, multi-warehouse products and products with options in the product page widget, in products loaded with a separate request, in product previews on category pages, modal windows and old templates, plus price recalculation when the variant and options change.

On 26 December 2023 I ported options support to every product page and cart widget. The release order was: backend first, then CommonJS, then the widgets. At first only merchants with the feature flag turned on had options, and I prepared an announcement for the support team. The flag was removed on 17 January 2024, after the documentation was ready. I described the options API myself for developers who build product pages and carts in their own templates.

## Results

- Since 17 January 2024, options have been available in every store, and latest-generation templates support them by default.
- Buyers choose required and optional extras, see the final price right away and add exactly that combination to the cart.
- One variant can be in the cart as several lines: quantity changes and deletion apply only to the chosen line, and each line reaches checkout with its own options.
- Store developers got a component and a documented cart API for options in their own templates. The library all this is built into is described in the [CommonJS case](/work/commonjs-storefront-library/).

Screenshots were taken in an inSales demo store with freely licensed photos. The products and prices are made up for the example and aren’t linked to real sales.
