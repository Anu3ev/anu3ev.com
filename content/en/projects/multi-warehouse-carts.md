---
title: Multi-warehouse carts for wholesale buyers
description: "A cart for inSales wholesale storefronts where buyers set quantities separately for each warehouse, and each warehouse has its own cart and totals. I built it in the shared storefront JavaScript library and shipped it to production on 1 November 2023."
locale: en
slug: multi-warehouse-carts
published: true
cover: /images/work/multi-warehouse-carts/catalogue-quantity-per-warehouse.webp
coverAlt: "Illustration of a wholesale catalog: a bouquet has separate quantity fields for the main and partner warehouses, 15 and 8 units, next to the stock available in each warehouse"
category: Storefront platform
year: Aug 2023 – Nov 2023
context: inSales
role: "Owned the storefront side: shared library, API contract, testing, release"
stack: [JavaScript, AJAX, Liquid]
featured: false
order: 9
---

## The problem

Some stores on inSales sell wholesale from several warehouses in one catalog, for example their own and a partner’s. A wholesale buyer in these B2B stores orders each product from a specific warehouse, such as 15 units from the main warehouse and 8 from the partner’s. Each warehouse needs its own cart with its own quantities and totals.

![Illustration of a wholesale catalog: a bouquet has separate quantity fields for the main and partner warehouses, 15 and 8 units, next to the stock available in each warehouse](/images/work/multi-warehouse-carts/catalogue-quantity-per-warehouse.webp)

A [case study published by inSales](https://www.insales.ru/blogs/cases/hited) shows why stores sell partner stock: for one store with a 45,000-SKU catalog, partner warehouses brought 21% of its online sales in 2024.

The storefront cart was built for one list of products. Every cart operation in [CommonJS](/work/commonjs-storefront-library/), the shared JavaScript library of inSales storefronts, was tied to a product variant. In the wholesale case the warehouse matters too: one variant can have different quantities in different warehouse carts.

Every storefront loads the library, so a change to it also affects single-warehouse stores that don’t need this feature. In those stores the regular cart had to keep working as before.

## My role

I owned the storefront side, from implementation to release: I worked on the shared library, wrote down the API changes the frontend needed and agreed on the response format with the backend developer who built the server side. With the product manager I agreed on priorities and edge cases, such as whether price types should be taken into account for each warehouse. During testing I investigated failures in the warehouse carts. I started in August 2023.

## What I built

### Warehouse cart logic in the library, not in a widget

I started with the question of where the warehouse cart logic should go. CommonJS already calculates the price of each cart line and the price for a given quantity, and all of this connects to templates through data attributes that product widgets rely on. So I put the warehouse cart logic in the library, not in the cart widget: I extended the library’s components so that adding a product, changing its quantity and removing it all take the warehouse into account.

For each warehouse, I agreed with the backend developer on the response fields: the total without discounts and the total with discounts. On 17 August 2023 the test version of the library started showing the total and total weight for each warehouse. I also asked for the stock of each variant in each warehouse. The catalog illustration shows the stock in the Available column and the cart quantity in the Quantity field.

### Quantity is calculated from the selected warehouse’s cart

When a buyer enters a new quantity, the library calculates how many units to add or remove. The `Cart.set` method sets a product’s quantity, and before the fix it took the starting quantity from the regular cart instead of the selected warehouse’s cart. So if the warehouse cart had 15 units and the buyer reduced the quantity to 5, it could end up with 19.

![Quantity calculation diagram. Before: the starting quantity is taken from the regular cart, the method adds 4 units instead of removing 10, and the warehouse cart has 19 units. After: the starting quantity is taken from the main warehouse cart, 15 units, the method removes 10 units, and the warehouse cart has 5 units](/images/work/multi-warehouse-carts/quantity-from-selected-warehouse.svg)

I fixed it so the starting quantity comes from the selected warehouse’s cart, and adding, changing the quantity and removing products apply to that cart. Now, when the buyer goes from 15 to 5, the library removes 10 units from the warehouse cart. After each operation, the interface shows the cart that the operation changed.

I also connected warehouse cart updates to the quantity fields on the product page and in the cart: after the server responds, each field gets the quantity of its variant in its warehouse. If the buyer reduces the main warehouse quantity from 15 to 5, only that warehouse’s cart and total change, and the partner warehouse cart keeps its 8 units.

![Illustration of the main warehouse cart after the quantity changed from 15 to 5: the warehouse total is $200, and the total for all warehouses is $520](/images/work/multi-warehouse-carts/main-warehouse-cart-after-change.webp)

![Illustration of the partner warehouse cart after the same change: still 8 units and a warehouse total of $320, and the total for all warehouses is $520](/images/work/multi-warehouse-carts/partner-warehouse-cart-after-change.webp)

### Changes for different warehouses are no longer lost

On 28 September 2023 I found a race condition between requests. If a buyer quickly added products to different warehouses, the requests went out without waiting for the previous response and could finish in any order. A response that arrived later could overwrite the cart that another request had already changed. As a result, a product disappeared from one warehouse’s cart.

In the regular cart, CommonJS combines pending operations into one request. The right approach for warehouses would have been the same: send the changes for all warehouses in one request, with products grouped by warehouse. I described the failure and wrote this requirement, but the server accepted only one warehouse per request, and a new format would have broken compatibility with the regular cart. So for warehouse operations I built a queue: each request goes out only after the previous one gets a response. On 1 November 2023 I shipped CommonJS with the warehouse carts and this fix.

### Single-warehouse stores work as before

Warehouse carts are visible only to buyers in the B2B customer group and only in stores where the option that lets buyers choose a warehouse for their order is turned on in the Store profile section of the settings. I took both conditions into account, so all other buyers and stores use the regular cart.

When warehouse carts are turned off, widgets add products without a warehouse, and the server returns only the regular cart. So I handled the regular cart separately from the warehouse carts: if the response has no warehouse carts, the quantity fields are filled from the regular cart, as before.

## Results

- On 1 November 2023 the warehouse carts went to production.
- A wholesale buyer sets quantities separately for each warehouse, and each warehouse has its own cart with its own quantities and totals.
- The quantity changes in the selected warehouse’s cart, and the fields on the product page and in the cart show the same quantity.
- Changes for different warehouses are no longer lost: warehouse requests go out one after another.
- Single-warehouse stores work with the regular cart as before.

The catalog and cart illustrations were made for the project presentation: the store, products and prices are made up for the example.
