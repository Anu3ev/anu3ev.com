---
title: Multi-warehouse carts for wholesale buyers
description: "A cart for inSales wholesale storefronts where buyers set quantities separately for each warehouse, and each warehouse has its own cart and totals. I built it in the shared storefront JavaScript library and shipped it to production on 1 November 2023."
locale: en
slug: multi-warehouse-carts
published: true
cover: /images/work/multi-warehouse-carts/catalogue-quantity-per-warehouse.webp
coverAlt: "Illustration of a wholesale catalog: a bouquet has separate quantity fields for the main and partner warehouses, 15 and 8 units"
category: Storefront platform
year: Aug 2023 – Nov 2023
context: inSales
role: "Owned the storefront side: shared library, API agreement, testing, release"
stack: [JavaScript, AJAX, Liquid]
featured: false
order: 9
---

## The problem

Some stores on inSales sell wholesale from several warehouses in one catalog, for example their own and a partner’s. Wholesale buyers in these B2B stores order a product from a specific warehouse, for example 15 units from the main warehouse and 8 from the partner’s. Each warehouse needs its own cart with its own quantities and totals.

The storefront cart was built for one list of products. Every cart operation in [CommonJS](/work/commonjs-storefront-library/), the shared JavaScript library of inSales storefronts, was tied to a product variant, but in the wholesale case the warehouse matters too: one variant can have different quantities in different warehouse carts.

Every storefront loads the library, so a change to it also affects single-warehouse stores that don’t need this feature.

![Illustration of a wholesale catalog: a bouquet has separate quantity fields for the main and partner warehouses, 15 and 8 units](/images/work/multi-warehouse-carts/catalogue-quantity-per-warehouse.webp)

## My role

I owned the storefront side, from implementation to release: I worked on the shared library, wrote down the API changes the frontend needed and agreed on the response format with the backend developer who built the server side. I clarified priorities and open product questions with the product manager, and during testing I investigated failures in the warehouse carts. I started in August 2023.

## What I built

### The warehouse cart logic stayed in the library

I started with the question of where the warehouse cart logic should live. CommonJS already calculates the price of each cart line and the price for a given quantity, and all of this connects to templates through data attributes that product widgets already rely on. So instead of moving these calculations, quantity changes and removing products into the cart widget, I extended the library’s own components.

For each warehouse, I agreed with the backend developer on the response fields: the total without discounts and the total with discounts. I also asked for the stock of each product inside a warehouse cart, because the old quantity field only showed how many units the buyer ordered. In August 2023 the test version of the library already showed the total price and total weight for each warehouse, and the regular cart worked alongside the warehouse carts.

### Quantity is calculated from the selected warehouse’s cart

When a buyer enters a new quantity, the library calculates how many units to add or remove. The `Cart.set` method, which sets a product’s quantity, calculated this change from the quantity in the regular cart instead of the cart of the given warehouse. So if a warehouse cart had 15 units and the buyer reduced the quantity to 5, the cart could end up with 19.

I fixed it so the starting quantity comes from the selected warehouse’s cart, and adding, changing the quantity and removing products apply to that cart. After each operation, the interface shows the state of the cart the operation changed.

![Illustration of the main warehouse cart after the quantity changed from 15 to 5: the warehouse total is $200](/images/work/multi-warehouse-carts/main-warehouse-cart-after-change.webp)

### Responses for different warehouses no longer overwrite each other

On 28 September 2023 I found a race condition between requests. If a buyer quickly added products to different warehouses, the requests went out without waiting for the previous response, and a later response could overwrite an earlier one: a product disappeared from one warehouse’s cart. In the regular cart, CommonJS combines pending operations into one request, but that wasn’t possible for warehouses, because the server accepted only one warehouse per request.

I described the failure and wrote a requirement to send changes for several warehouses in one request, grouped by warehouse. But that needed the server to accept several warehouses per request, which would break compatibility with the old cart. So for warehouse operations I made requests go strictly one after another: each request goes out only after the previous one has finished. On 1 November 2023 I shipped CommonJS with the wholesale carts and this fix.

### The regular cart works as before

Warehouse carts are visible only to buyers in the right customer group and only in stores with B2B settings turned on, and the library shows them only when both are true. If a widget added a product without a warehouse, the server turned warehouse mode off, and the same product can be added from different widgets on a page. So I checked that the warehouse choices are kept when products are added from the catalog, the home page and related products, and I handled regular cart data separately from warehouse cart data.

![Illustration of the partner warehouse cart: 8 units and a warehouse total of $320](/images/work/multi-warehouse-carts/partner-warehouse-cart.webp)

## Results

- On 1 November 2023 the wholesale warehouse carts went to production.
- A wholesale buyer sets quantities separately for each warehouse, and each warehouse has its own cart with its own quantities and totals.
- Changes for different warehouses are no longer lost: warehouse requests go out one after another.

A [case study published by inSales](https://www.insales.ru/blogs/cases/hited) shows why partner stock matters: for one store with a 45,000-SKU catalog, partner warehouses brought 21% of its online sales in 2024.

The illustrations were made for the project presentation: the store, products and prices are made up for the example.
