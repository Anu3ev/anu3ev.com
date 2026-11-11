---
title: Product options and extras on the storefront product page and cart
description: "I added product options to the inSales storefront product page and cart: the selection component, price recalculation and cart operations. One variant with different options now becomes separate cart lines, and each line reaches the checkout page with its own options."
locale: en
slug: product-options
published: true
cover: /images/work/product-options/product-page-gift-box-and-card.webp
coverAlt: "Demo-store product page for a bouquet with the Classic size, a gift box and a greeting card selected, and the price updated to $48"
category: Storefront platform
year: Oct 2023 – Jan 2024
context: inSales
role: "Frontend in the storefront JavaScript library: ui-accessories, prices, cart API, release"
stack: [JavaScript, Liquid, AJAX]
featured: false
order: 10
---

## The problem

inSales is an e-commerce SaaS platform with more than 60,000 online stores. With options, a store owner adds extras and services to a product, such as gift packaging or a greeting card. The buyer chooses options on the product page, and the price updates right away. Options are grouped, and for each group the owner sets the minimum and maximum number of values, so some options are required and others are optional.

The hardest part was the cart. On the storefront, the cart is run by [CommonJS](/work/commonjs-storefront-library/), inSales’s in-house storefront JavaScript library (the name matches the CommonJS module format, but they are different things). The library identified a cart line by its product variant, for example a bouquet size. With options, that was no longer enough. A Classic bouquet in standard wrapping and the same bouquet in a gift box with a card are two cart lines with different prices. Code that found a cart line by variant ID could change or delete the wrong line. The counters on the product page and the stock check could also show the wrong quantity.

The examples in this case come from a demo store on inSales, and its products and prices are made up.

## My role

I built the storefront side in CommonJS: the `ui-accessories` component, price recalculation, cart operations, and showing options in the cart and on the checkout page. I was also responsible for releasing options on the storefront. A backend developer built the server side of options, and I chose the data format between the storefront and the server: he suggested formats, and I decided what the storefront needed. The work ran from October to December 2023, alongside [multi-warehouse carts](/work/multi-warehouse-carts/).

## What I built

### Options render in any widget, and errors show under each group

Options aren’t only needed on the product page. If a product has required options, it can’t be added to the cart without them. And buyers can also add products from previews on category pages and from [AJAX-loaded products](/work/storefront-product-loading/), which load onto the page with a separate request. So instead of tying options to the product page, I built the `ui-accessories` component, which renders them from data attributes. It connects through `data-accessories="{{ product.id }}"` and builds option groups from templates in the markup, so it works in both built-in and custom widgets.

To render options in any widget, the library needs their data together with the product data. At the end of November 2023 I filed a task for the backend developer to return options from `products_by_id` and the other API methods that the library uses to get product data.

Each group has a minimum and a maximum number of values. In the demo store, the packaging group requires exactly one value, and the extras group allows zero to two. The component itself enforces the maximum: once the maximum number of values is chosen, the other checkboxes in the group are disabled.

![Options of the Classic bouquet in the demo store: the gift box is selected, the greeting card and chocolate truffles are checked in the Extras group (up to two), the Satin ribbon checkbox is disabled, and the price is $57](/images/work/product-options/product-page-extras-limit.webp)

The minimum can’t be enforced this way: disabling checkboxes doesn’t make a buyer choose a value. So if too few values are chosen, the server returns an error. I agreed with the backend developer on the error format. The cart’s `errors` include an error for the specific variant, with the variant ID and the product ID, so the library can show the error on the right product.

At first, the plan was to show the error in a pop-up notification. But if a product has many option groups and nothing is chosen in any of them, the notification would cover the whole screen. So I showed the error as text under each option group and made the page scroll to the first group with an error.

### The price depends on the variant and the options

The price is recalculated when the buyer changes the variant or the chosen options. In the demo store, a gift box (+$5) and a card (+$3) raise the price of the Classic bouquet from $40 to $48. For the Grand size, the same extras raise it from $60 to $68. The price checks had to treat zero as a normal value: a variant can cost $0, and standard wrapping adds $0 too.

![Demo-store product page for a bouquet with the Classic size, a gift box and a greeting card selected, and the price updated to $48](/images/work/product-options/product-page-gift-box-and-card.webp)

### A cart line combines the variant and its options

For the cart to tell lines of one variant apart, the chosen options had to be sent together with the variant ID. On 25 October 2023 the backend developer and I agreed on the data format. He suggested two formats. The first was a new `accessoriable_variant_ids` structure that lists, for each variant, its cart lines with the IDs of the chosen options and the quantity. The second was the format that the `/cart_items_with_accessories` method already accepted: an `order_lines` array with a `variant_id` and a list of `accessory_value_ids` for each line.

I chose the first: it’s easier to handle on the backend, and it goes in the same cart request, `/front_api/cart`, as the existing `variant_ids` list. The same day we found that Rails, the framework the inSales backend is built on, didn’t parse the array of option IDs in this request’s parameters. So we started sending option IDs as an object that maps each ID to a quantity: `"accessory_value_ids": { "4097249": 1 }`. This format also makes it possible to send a quantity for each option later.

I updated `Cart.add`, `Cart.set`, `Cart.delete` and the cart task queue, which combines pending cart operations into one request. Now they send the chosen options together with the variant ID. Quantity changes and deletion apply to one specific cart line, not to every line with that variant. In the cart widget, each line shows the names of its chosen options.

I tested every backend build on staging and found bugs before the release. For example, a product without options was merged into the cart line of the same product with options. And the limit check compared all chosen values with the minimum and maximum of one group.

![Demo-store cart with the Classic bouquet as two lines: standard wrapping for $40, and a gift box with a greeting card for $48, each line with its own options](/images/work/product-options/cart-same-variant-two-lines.webp)

### The counter follows the cart line, and stock is counted per variant

After a product is added, the Add to cart button turns into a quantity counter. With options, the counter shows the quantity of the selected cart line, not of the whole variant. If the buyer switches from standard wrapping to a gift box with a card, the counter shows the quantity of that line. And if standard wrapping is selected and the buyer deletes that line, the Add to cart button comes back, even though the gift-box line is still in the cart.

![Mobile product page of the Classic bouquet in the demo store: with standard wrapping the counter shows 7 pcs., with a gift box and a greeting card it shows 9 pcs., and the cart icon shows 16](/images/work/product-options/product-page-counter-per-line.webp)

Stock, on the other hand, belongs to the variant. Both lines contain the same Classic bouquet, so their quantities are added up for the stock check. I went through every place where a cart line was found by variant ID and separated the line quantity from the variant stock in each of them.

### Each line reaches the checkout page with its own options

On 7 December 2023 I noticed that three lines of one product with different options reached the checkout page as a single line. The cart form sent only variant IDs and quantities to checkout, without the options. These fields couldn’t be dropped, because quantity changes, deletion and price recalculation in CommonJS and in every cart widget depend on them.

So I wrote a handler for the Checkout button. When the buyer clicks it, the handler checks whether the form has options and adds fields for them. It also numbers the cart lines, so that each one reaches the checkout page separately, with its own options. I didn’t add these fields directly to the widget code, because the indexes in the markup and in JavaScript could get out of sync.

### Options were turned on gradually, behind a feature flag

Before the release I wrote a test checklist for regular products and products with options: adding them to the cart, changing the quantity and deleting them. It covered the product page, AJAX-loaded products, previews on category pages, modal windows and old templates.

On 26 December 2023 I added options support to every built-in product page and cart widget in one day. At first, options worked only in stores with the feature flag turned on, and I wrote an announcement for the support team. On 17 January 2024, once the documentation was ready, the flag was removed, and options became available in every store. Latest-generation templates support them by default.

In February 2025 I worked on the description of the options API in the documentation for store developers who build the product page and cart in their own templates.

## Results

- Since 17 January 2024, options have been available in every store, and latest-generation templates support them by default.
- Buyers choose options, both required and optional, see the final price right away and add the product with exactly those options to the cart.
- One variant can be in the cart as several lines: quantity changes and deletion apply only to the chosen line, and each line shows up on the checkout page with its own options.
- Store developers can add options to their own templates with the `ui-accessories` component and the cart API described in the documentation.

The library that options are built into is described in the [CommonJS case](/work/commonjs-storefront-library/).
