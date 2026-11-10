---
title: "Abandoned Carts: a paid inSales section for merchants"
description: "Merchants couldn’t see who left a cart or what was in it. I was the only frontend developer of Abandoned Carts, a paid inSales section with analytics, cart versions and messages to buyers. 11 stores paid for it in the first week; by September 2026 it had 200+ subscribers."
locale: en
slug: abandoned-carts
published: true
cover: /images/work/abandoned-carts/cart-details-drawer.webp
coverAlt: Cart details drawer in the inSales admin listing three products, the cart total, a Place an order button and an empty communication history
category: Merchant tools
year: Oct 2024 – Apr 2025
context: inSales
role: "Sole frontend developer: requirements, API design with the backend, implementation, release"
stack: [Vue.js, JavaScript, Vue Router, ApexCharts, Monaco Editor, REST API]
featured: false
order: 5
results:
  - value: "200+"
    label: "active paid subscribers by September 2026"
  - value: "11"
    label: "stores paid for the section in the first week after release, before any announcement"
  - value: "15%"
    label: "of Hited’s customers come back and complete a purchase thanks to retargeting (inSales case study, May 2025)"
---
## The problem

A buyer adds products to an online store’s cart and leaves without placing an order. Before the new section, a merchant on inSales could send such a buyer only one automatic email, from a template in the Dialogues section. In January 2025, 259 paying stores had that template turned on. But the merchant couldn’t see who had left, what was in the cart or whether the reminder worked. According to the team lead’s estimate in October 2024, 325 stores had more than 50 abandoned carts a month, and 1,077 stores had at least 10.

The new paid Abandoned Carts section had to show the merchant every abandoned cart with its products, total and history of changes, so the merchant could write to the buyer by email, SMS or a messenger, manually or automatically. The section works only with carts of registered buyers: collecting the carts of visitors who aren’t signed in would break the law.

## My role

I was the only frontend developer on a team with a backend developer, a product manager, a designer and a QA engineer. The backend developer built cart storage, the analytics calculations and scheduled sending, and I owned the section’s frontend: from technical requirements and agreeing the API with the backend developer to testing and release. The main development ran from October 2024 to April 2025, in iterations and alongside other tasks.

At first, the task was mostly a set of mockups. I turned them into technical requirements: I defined the entities and states, worked through unclear scenarios and edge cases, agreed on the section’s logic with the designer and on the data structure for each block with the backend developer. I proposed most of the API structure for the frontend myself. For example, at first one request returned both the section’s connection status and all carts at once, so the table couldn’t be moved into a separate component. I suggested checking the status with a separate request; in November 2024 that was done, and I then moved the table into its own component. I often organized the project meetings: I wrote the agenda, and after each call I wrote up the decisions and who was responsible for what.

## What I built

### The analytics show how much money is left in carts

The section starts with analytics, which shipped first, on 28 October 2024. The merchant sees the average abandoned cart value, the total value of products in carts without an order, the number of abandoned carts, their trend over time and the cart-to-order conversion rate. The business metrics are calculated on the server. While the server side wasn’t ready, I built the interface on mock data.

From the numbers, the merchant moves to a table of carts with search and filters, for example by whether the buyer has an email or a phone number, and a cart from the table opens in the Cart details drawer, a side panel over the page. The analytics period doesn’t depend on the table filters, so the merchant can look at the trend for a month while working with their own selection of carts.

### A cart keeps a history of versions

One of the main tasks was to agree on what counts as one cart. A buyer can leave, come back and change the products. That’s one cart with several saved versions, not two buyers and not two lost sales. A version is created when the cart stays unchanged for a time set in the settings, and after an order is placed, a new cart starts a new chain of versions. In the table, the merchant sees one cart with its current version; the cart’s number stays the same when the products change, and the earlier versions become its history.

![Cart details drawer in the inSales admin listing three products, the cart total, a Place an order button and an empty communication history](/images/work/abandoned-carts/cart-details-drawer.webp)

The cart details show the last 10 versions, and this limit comes from a case I checked in advance. If the time after which a cart counts as abandoned is set short, one cart quickly collects many versions. I created a cart with 200 versions in my local environment, and its history took about 20 seconds to load. As of 25 November 2024, the longest chains in production reached 74 versions. Colleagues thought it would never get to 200, but I insisted it was better to handle this case before the release than to rework the section later.

The same product can appear in a cart as several items with different options, so in the history of changes I distinguished items by the item `key`, not by the product `id`. Otherwise the interface would have treated two different items as one.

### The screen shows only the response to the latest request

A merchant types in the search box, goes through pages and opens one cart after another without waiting for responses. If a late response to an old request reached the screen, the merchant would see the wrong buyer or the wrong version of the products. So I tagged search requests with IDs and dropped responses that didn’t belong to the latest request. I canceled drawer loading with `AbortController`, the standard browser way to cancel requests, when the merchant closed the drawer.

Search, filters, the page number and the open cart are stored in the URL, so after a reload or from a shared link the same screen opens.

### Each channel has its own settings

For automatic reminders, the merchant sets how long it takes before a cart counts as abandoned and how long after that the reminder goes out. The server sends the scheduled reminders, so they go out even when the merchant doesn’t have the inSales admin open.

At first, automatic sending could be turned on only in Dialogues. Then, on 5 December 2024, I found a problem: a merchant could send an email manually from the section, but if the store had no email on its own domain set up, the email was never sent and the interface said nothing about it. After a call on 6 December, we decided that each channel would get its own settings: whether the channel is set up, an automatic sending toggle, a delay and a template, and a channel that isn’t set up shows a message with a link to connect it. The send form now shows only channels that work.

![Abandoned cart settings with the time before a cart counts as abandoned and an email template in the code editor](/images/work/abandoned-carts/reminder-settings-email-template.webp)

The product has five channels: email, SMS, WhatsApp, Telegram and Viber. Which ones are available depends on the store’s settings and region: for example, Viber is hidden for Russian accounts.

### Bulk sending shows who won’t get the message

A merchant can write to one buyer, or select several carts and send one message to all of them. In bulk sending, some of the selected buyers may have no email or phone number. I raised the question of whether to send the message to the rest or to nobody, and suggested not blocking a channel if at least one selected buyer has the needed contact. After the discussion, bulk sending was limited to email and SMS, and "has email" and "has phone" filters were added. The form now shows how many buyers lack the needed contact and offers to filter for suitable carts. For that, I proposed a new data structure for the form, and the backend developer built it.

We didn’t build a "select all carts on all pages" action. A store can have tens of thousands of carts: collecting data for all of them would take a series of requests lasting several minutes, and sending messages to all those buyers at once could overload the server. So selection works on the current page, and the merchant can add carts from other pages.

### Templates are edited as code, with a preview

Messages are built from templates in Liquid, a template language that inserts the buyer’s name, products, prices and links into the text. At first, email templates were edited in the TinyMCE visual editor, and it broke Liquid: it encoded some characters and removed tags and attributes, after which the server could no longer use the saved text as a template. I suggested replacing it with a source code editor with a preview, and then doing the same for SMS and messengers, because their templates also contain Liquid variables and also need a preview.

I reused the shared [Monaco editor build](/work/monaco-editor/) I had worked on before. The preview asks the server for the template filled with a specific cart’s data: the buyer’s name, products, quantities, prices and total, so the merchant sees the final message before sending it.

![Email preview rendered with the selected cart’s data next to the message form](/images/work/abandoned-carts/email-preview-with-cart-data.webp)

### A message shows the cart as it was when the message was sent

Every sent message goes into the communication history and is linked to a specific cart version. If the buyer changed the products after a reminder, the message shows the cart as it was when the message was sent, not as it is now. Otherwise the communication history would be wrong, and the merchant wouldn’t know what had already been offered. After sending, the table and cart details reload, so the merchant sees the status the server returns, and a request the server only accepted doesn’t look like a delivered message.

### Access has more than two states

The section is paid, so a store first starts a 7-day trial with 100 messages and then pays 1,000 rubles a month for a subscription. A single "has a subscription" flag wasn’t enough for the interface: the server returns the trial state and end date, overdue payments, invoices, the price and the remaining messages, and the banners, buttons and settings depend on them. When access changes, the interface updates right away: for example, after the trial starts, the settings become available.

### The section went through QA testing before release

I wrote test scenarios for QA: closing the drawer during a request, repeated search, an empty selection, products with options, the link between a cart and an order, missing contacts, channel state and the template preview. By 16 December 2024, QA had found more than 40 bugs, which were fixed before the release.

The section works on desktop and mobile. For this section, I improved the date picker, filter and table in the UI kit, inSales’s shared library of interface components.

## Results

- The section went to production on 31 March 2025. In the first week, before any announcement, 11 stores paid for it.
- By September 2026, the section had more than 200 active paid subscribers.
- The merchant now sees in one place who left a cart, what was in it and how it changed, and writes to the buyer manually, in bulk or automatically.
- In a [case study from 20 May 2025](https://www.insales.ru/blogs/cases/hited), inSales reports that abandoned-cart retargeting, meaning follow-up messages to buyers who didn’t place an order, brings the Hited store 100,000–350,000 rubles a month, and 15% of customers come back and complete a purchase.
