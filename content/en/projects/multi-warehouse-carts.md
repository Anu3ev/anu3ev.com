---
title: Multi-warehouse carts for wholesale buyers
description: Warehouse-specific carts for inSales wholesale storefronts. Buyers set quantities per warehouse, and the shared storefront library sends changes for several warehouses in one request. In production by November 2023.
locale: en
slug: multi-warehouse-carts
published: true
cover: /images/work/multi-warehouse-carts/grouped-cart-update.svg
coverAlt: Diagram of buyer changes for two warehouses queued in the cart library and sent as one request grouped by warehouse
category: Storefront platform
year: "2023"
role: Owner of the storefront implementation and API coordination
stack: [JavaScript, CommonJS storefront library, REST API, Liquid]
featured: false
order: 8
---

## The problem

Some inSales merchants sell wholesale from more than one stock source: their own warehouse and a partner's, shown in one catalogue. A wholesale buyer needs to say "15 units from the main warehouse, 8 from the partner" for the same product, and the cart has to keep those choices apart, each warehouse with its own quantities and subtotal.

The storefront cart was built around a single list of items. Every cart operation in CommonJS, the shared JavaScript library that inSales storefronts use, assumed one cart. Storefronts call it from many places: the product page, the catalogue, the home page, related-product widgets. A change to it affects a lot of stores, including those with one warehouse that never use this feature.

## My role

I owned the project from storefront implementation to production. I extended the shared library, specified the API changes the frontend needed, and agreed the response format with the backend developer, who implemented the server side. I clarified priorities and open product questions with the product manager, and investigated failures across warehouse carts during testing. I started in August 2023, and the feature was in production by November 2023.

## What I built

### The warehouse travels with every cart operation

The library's add, update and remove operations had no way to say which warehouse a change was for. I extended all three to carry the selected warehouse, so a product page with two quantity fields could update the right warehouse group. I also agreed with the backend which response fields the interface relies on. One example: the top-level warehouse in the response refers to the main cart's warehouse, which is not necessarily the warehouse of the last operation. The library's response handling follows that agreement.

### Quantity changes start from the selected warehouse

When a buyer types a new quantity, the library works out how many units to add or remove. It read the starting value from the wrong cart, so a change for one warehouse could be calculated against another. I changed the calculation to read the current quantity from the selected warehouse's group: if the buyer has 15 units there and asks for 5, the library removes 10.

Available stock and ordered quantity are also separate data. I requested stock per item inside each warehouse group, because the existing quantity field only said how much the buyer had ordered.

### Overlapping requests could lose a selection

During testing I found that quick changes to different warehouses could overwrite each other. A buyer could select items for both warehouses and end up with only one selection in the cart. The library already merged queued tasks into one request, but the old API accepted one warehouse per request, so changes for two warehouses had to go separately and could overlap.

I documented the failure and specified the change: the library collects pending changes for several warehouses and sends them as groups in one request, and the server applies each group to the matching warehouse. The backend developer built the server part.

### Ordinary carts keep working

A request without a warehouse switched the cart out of multi-warehouse mode, and the two modes could not run at the same time. Since one product could be added from different widgets on the same page, I checked how warehouse choices survived additions from the catalogue, home page and related products. I kept the ordinary cart data path separate from the warehouse-grouped one, so single-warehouse stores kept their familiar quantity controls and their existing code.

### Product controls and cart show the same numbers

I connected warehouse-cart updates to the product controls, so the product page and the cart show the quantity selected for each warehouse. I also investigated a case where the buyer changed a quantity and went to checkout right away: two requests reached the server, the last response was correct, but the widget showed the result of the first one. I reproduced it and recorded it for the team.

## Results

- The feature was in production by November 2023. I started work in August 2023.
- Wholesale buyers could set quantities per warehouse, and the cart showed each warehouse with its own quantities and subtotal.
- The grouped update shipped: changes for several warehouses go to the server in one request, which closed the lost-selection case I found in testing.
- Stores with a single warehouse kept the ordinary cart without changes to their code.

I don't have a usage or revenue figure for this feature. For context on why merchants sell partner stock: in a [case study published by inSales](https://www.insales.ru/blogs/cases/hited), one merchant with a 45,000-SKU catalogue reported that partner warehouses accounted for 21% of its online sales in 2024. That is the merchant's own figure, not a result of my work.
