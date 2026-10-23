---
title: "Abandoned carts: a paid inSales product for merchants"
description: Analytics, cart history, filters and manual, bulk and automatic reminders in the inSales admin. I was the sole frontend developer; the product has 200+ active paid subscribers.
locale: en
slug: abandoned-carts
published: true
cover: /images/work/abandoned-carts/cart-details-drawer.webp
coverAlt: Cart details drawer in the inSales admin listing three products, the cart total, a Place an order button and an empty communication history
category: Merchant tools
year: Oct 2024 – Apr 2025
context: inSales
role: "Sole frontend developer: requirements, API contracts, implementation, release"
stack: [Vue.js, JavaScript, Data Visualization, REST APIs, Front-End Development, State Management, Responsive Web Design, Requirements Analysis, Technical Documentation, Vue Router, Monaco Editor, E-Commerce Development, Software Architecture, ApexCharts, Software as a Service (SaaS)]
featured: false
order: 4
results:
  - value: "200+"
    label: "active paid subscribers by September 2026"
  - value: "15%"
    label: "of one merchant's customers returned to complete a purchase, per an inSales case study (May 2025)"
---

## The problem

Before checkout, a store has no order to work with. Yet the shopper has already picked products, and the merchant would like to know what they chose, for how much, and whether the cart changed since. Abandoned Carts is a paid inSales product that turns this into something to act on: the merchant finds unfinished purchases by registered customers, inspects them and follows up from the admin.

The product combines analytics, a cart table with filters, cart details and history, communication history, message templates with preview, and paid access. Each of these depends on the others: a filter decides who gets a bulk message, the selected cart feeds the preview, a send updates the table and the history.

## My role

I was the only frontend developer, working with a backend developer, a product manager, a designer and QA. The task started mostly as mockups. I turned them into technical requirements: entities, states and edge cases, and the JSON structure for every block, agreed with the designer and the backend developer. Then I split the work, built the interface, wrote QA scenarios and took it through review and release. The backend stores carts, calculates analytics and runs scheduled sending. Main development ran from October 2024 to April 2025, in iterations alongside other work.

## What I built

### A cart is a history, not a row

A shopper can leave a cart, come back and change it. That is one cart with several saved versions, not two lost sales. We agreed on the model together: cart session, version, latest version, resulting order, and messages tied to a specific version. The table shows a stable cart number that does not change with each update, and cart details show the last 10 versions. A product can appear twice with different options, so I keyed history rows by line-item key instead of product ID.

### Messages keep the cart they were sent about

When a merchant opens a message from the history, the interface shows the cart contents at the time it was sent, not the current ones. Showing the latest contents there would quietly rewrite the conversation with the customer. History also distinguishes not sent, failed and sent, and after a successful send the table and cart details reload, so the status never runs ahead of the server.

### Only the latest response may update the screen

Merchants type in search, flip pages and open one cart after another before responses arrive. A late answer to an old query must not replace newer results. I tagged search requests with IDs and dropped stale responses, cancelled drawer loads with `AbortController` when the drawer closed, and stopped rendering closed drawers so a hidden panel cannot react to data changes. Search, filters, pagination and the open cart live in the URL, so a page reload or a shared link restores the same view.

![Abandoned cart settings with the time before a cart counts as abandoned and an email template in the code editor](/images/work/abandoned-carts/reminder-settings-email-template.webp)

*Reminder settings: when a cart counts as abandoned, then a per-channel delay and template.*

### Access has more than two states

One "subscribed" flag was not enough. The server returns trial state and expiry, overdue payment, invoices, price and remaining message limits, and those drive banners, buttons and settings. After a trial starts, settings become available immediately. The payment component is created only when its dialog opens, so a hidden dialog never starts its own operations.

### Three ways to send, one template workflow

Merchants can message one customer, select carts across pages for a bulk email or SMS, or configure automatic reminders per channel. Before a bulk send, the form shows how many selected customers lack the required contact and offers to filter them out. We deliberately left out a "select every cart" action because of the load it could create. Templates are edited in our shared Monaco-based editor, and the preview renders Liquid with the selected cart's products, quantities and totals.

![Email preview rendered with the selected cart's data next to the message form](/images/work/abandoned-carts/email-preview-with-cart-data.webp)

## Results

- The product has 200+ active paid subscribers (as of September 2026), at a list price of RUB 1,000 a month after a 7-day trial.
- In a case study published in May 2025, inSales reported that retargeting linked to abandoned carts brought one merchant, Hited, RUB 100,000–350,000 a month (about $1,200–4,400), with 15% of customers returning to complete a purchase. This is one store's result, not a platform average, and it is not a frontend-only effect.
- Analytics shipped in October 2024; the remaining frontend was finished and released by April 2025.
- The section works on desktop and mobile, and the date picker, filter and data table improvements went into the shared UI kit.
