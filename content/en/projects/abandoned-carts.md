---
title: "Abandoned Carts: a paid inSales section for merchants"
description: "Merchants on inSales couldn’t see who left a cart or what was in it. I built the frontend of Abandoned Carts, a paid section with analytics, cart version history and messages to buyers. 11 stores paid for it in the first week; by September 2026 it had 200+ subscribers."
locale: en
slug: abandoned-carts
published: true
cover: /images/work/abandoned-carts/cart-details-drawer.webp
coverAlt: Cart details drawer in the inSales admin panel listing three products, the cart total, a Place an order button and an empty communication history
category: Merchant tools
year: Oct 2024 – Apr 2025
context: inSales
role: "Frontend developer: requirements, API agreements with the backend developer, implementation, release"
stack: [Vue.js, JavaScript, Vue Router, ApexCharts, Monaco Editor, REST API]
featured: false
order: 5
results:
  - value: "200+"
    label: "active paid subscribers by September 2026"
  - value: "11"
    label: "stores paid for the section in the first week after release, before any announcement"
---
## The problem

A buyer adds products to an online store’s cart and leaves without placing an order. Before the new section, a merchant on inSales, an e-commerce platform, could send such a buyer only one automatic email, from a template in the Dialogues section of the admin panel. In January 2025, 259 paying stores had that template turned on. But the merchant couldn’t see who had left, what was in the cart or whether the reminder worked. And there were many abandoned carts: according to the team lead’s estimate in October 2024, 325 stores had more than 50 abandoned carts a month, and 1,077 stores had at least 10.

The new paid Abandoned Carts section in the inSales admin panel had to show the merchant every abandoned cart with its products, total and change history. From the same section, the merchant writes to the buyer by email, SMS, WhatsApp, Telegram or Viber, manually or automatically.

The section works only with carts of registered buyers, because collecting the carts of visitors who aren’t signed in would break the law. Also, a merchant can write to a buyer only if the buyer has the needed contact and the store has set up that channel.

## My role

I worked with a backend developer, a product manager, a designer and a QA engineer. The backend developer built cart storage, the analytics calculations and the server operations, including scheduled sending. I owned the section’s frontend, from technical requirements and API agreements to testing and release, and I took part in agreeing on the product logic. The main development ran from October 2024 to April 2025, in iterations and alongside other tasks. The section shipped in parts: analytics first, then the table, messaging and paid access.

At first, the task was mostly a set of mockups. I turned them into documented technical requirements. I defined the entities and states and worked through unclear scenarios and edge cases. I agreed on the section’s logic with the designer, and on the JSON structure for each block with the backend developer. Then I split the requirements into tasks for analytics, the table, filters, cart details, sending messages and the communication history.

I proposed most of the API structure for the frontend myself, and the backend developer usually built it the way I suggested. For example, in the first version of the API, one request returned both whether the section was enabled for the store and all of the store’s carts, so the cart table couldn’t be moved into a separate component. I suggested checking first whether the section is enabled, and requesting analytics and carts separately. The backend developer made the status a separate request in November 2024.

I often organized the project meetings: I wrote the agenda, and after each call I sent a summary with the decisions and who was responsible for each one. People who missed a discussion only had to read one message.

## What I built

### Analytics and the table lead the merchant to a specific buyer

The section starts with analytics, which shipped first, on 28 October 2024. The merchant sees the average abandoned cart value, the total value of products in carts without an order (Lost income) and the number of abandoned carts. The analytics also show a chart of abandoned carts and the related orders over time, and the cart-to-order conversion rate. As agreed with the backend developer, the business metrics are calculated on the server, and the frontend requests the needed period and shows the result. While the server side wasn’t ready, I built the interface on mock data.

From the numbers, the merchant moves to the table of carts. It shows the cart number, the buyer and their contacts, the date, status, number of items, total, channel and communication status. Filters cover the cart status, date, total range, whether the buyer has a phone number or email, and the communication type (manual or automatic), status and channel. For example, a merchant can select carts without an order that have an email and no previous messages, and then send them one message in bulk.

![Abandoned carts analytics and table in the inSales admin panel: a chart of abandoned carts and orders for a month, a donut chart with 26.7% conversion, and a table with search, filters, cart statuses, channels and pagination](/images/work/abandoned-carts/analytics-and-cart-table.webp)

The analytics period doesn’t depend on the table filters, so the merchant can look at the trend for 7 or 30 days while working with their own selection of carts. Search, filters and the page number are saved in the URL. A cart from the table opens in the Cart details drawer, a side panel over the page, and the open cart is saved in the URL too. So after a page reload or from a shared link, the merchant sees the same screen, not the section’s initial state.

### A cart keeps a change history

One of the main tasks was to agree on what counts as one cart. A buyer can leave, come back and change the products. That’s one cart with several saved versions, not two buyers and not two lost sales. A version is saved when the cart stays unchanged for longer than the time after which it counts as abandoned. The merchant sets this time in the settings. Versions of one cart form a chain until the buyer places an order; after the order, a new cart starts a new chain.

I agreed on how this model appears in every part of the section. In the table, the merchant sees one cart with its current version. The cart’s number stays the same when the buyer changes the products, and the earlier versions become the history of that cart.

![Change history of cart 5566: the latest version with the Ordered status and five products, and below it an earlier version of the same cart with two products](/images/work/abandoned-carts/cart-version-history.webp)

The Cart details drawer shows the products, total, status, buyer details, change history and communication history. From here, the merchant can write to the buyer or create an order. The Place an order button passes the cart’s products to the existing order creation page in the admin panel.

![Cart details drawer in the inSales admin panel listing three products, the cart total, a Place an order button and an empty communication history](/images/work/abandoned-carts/cart-details-drawer.webp)

The change history shows no more than the last 10 versions. This limit comes from a case I checked in advance: if a cart counts as abandoned after a short time, it quickly collects many versions. I created a cart with 200 versions in my local environment, and its history took about 20 seconds to load. The backend developer checked production: as of 25 November 2024, the longest chains there reached 74 versions.

Colleagues thought real stores would never get to 200 versions, but I insisted it was better to handle this case before the release than to rework the section later. So at the call on 26 November 2024, we decided to show the last 10 versions in the change history and to open a version’s full product list separately. I wrote up the decisions of that call.

The same product can appear in a cart as several items with different options. So in the change history, I told items apart by the item’s `key` field, not by the product `id`. Otherwise the interface would have treated two different items as one.

### Only the response to the latest request reaches the screen

In the table and cart details, merchants work fast: they type in the search box, switch pages, open one cart after another and close the drawer without waiting for the server. Responses can come back in any order. For example, a request for the old search text may return later than the request for the new one. If such a late response reached the screen, the merchant would see the wrong buyer or the wrong cart contents.

So I tagged search requests with IDs and dropped responses that didn’t belong to the latest request. I canceled the drawer’s request with `AbortController`, the standard browser way to cancel requests, when the drawer was closed or an earlier request was no longer needed. I also stopped rendering the contents of closed drawers, so a hidden panel didn’t react to data changes or update the tables inside it.

After a message is sent, the table and cart details load again. So the communication status and history show the result without a manual page reload, and the status on the screen never gets ahead of the server. A request that the server has only accepted for sending must not look like a read message or a recovered order.

### Each channel has its own settings

Once the merchant has found the right carts, they can write to buyers in three ways: to one buyer manually, to several at once with bulk sending, or automatically, a set time after a cart counts as abandoned.

The settings for each channel came from a problem I found on 5 December 2024. A merchant could send an email manually from the section. But if the store hadn’t set up sending from its own email domain, the email was never sent, and the interface said nothing about it. At the same time, automatic sending could be turned on only in the separate Dialogues section, not in the new one.

I wrote the agenda, ran a call on 6 December and sent out the decisions, with an owner for design, frontend and backend. We decided that:

- each channel gets its own automatic sending toggle, turned on by default for email if email sending is set up;
- the sending delay is set separately for each channel;
- a channel that isn’t set up shows a notice with a link to set it up.

Now each channel has its own settings block: whether it’s set up, the automatic sending toggle, the delay and the template. A channel that isn’t set up is marked with a status and a message with a link to set it up.

![Abandoned cart settings: the time before a cart counts as abandoned, the Email block marked Not set up with a message and a Set up link, and an email template in the code editor below](/images/work/abandoned-carts/reminder-settings-email-template.webp)

For an automatic reminder, the merchant sets two times: how long before a cart counts as abandoned, and how long after that the message goes out through the channel. For example, a cart can count as abandoned after a few hours, and the reminder can go out right away or after a delay in minutes, hours or days. I built the settings interface and its API requests. The server sends the scheduled messages, so reminders go out even when the merchant doesn’t have the browser tab open.

Which of the five channels a store can use depends on its settings and the account’s region: for example, since April 2025 Viber has been hidden for Russian accounts.

### Bulk sending shows how many buyers won’t get the message

To write to one buyer, the merchant opens the send drawer, chooses a channel and a template, edits the text if needed and checks the preview. The buyer’s and the cart’s details stay visible in the same drawer. For email, the form has subject and body fields, and for SMS and messengers, one template field. It also shows which channels are available, blocks actions that can’t be done and explains why an error happened.

Bulk sending starts with selecting rows in the table. The merchant sees how many carts are selected and opens one send form for all of them.

![Cart table with one cart selected and a bar at the bottom that shows 1 selected and a Send a message button](/images/work/abandoned-carts/bulk-selection-send-message.webp)

For bulk sending, checking that the channel is set up isn’t enough: some of the selected buyers may have no email or phone number. I raised this issue on 9 December 2024.

After the discussion on 10 December, bulk sending was limited to email and SMS. We added "has email" and "has phone" filters and separated two statuses: "channel not set up in the store" and "buyer has no contact". Now, if some of the selected buyers have no email or phone number, the form shows how many of them lack the needed contact. It also suggests narrowing the selection to carts with that contact.

In January 2025, I proposed a new data structure for the send form. Before, the server repeated the same list of channels for every selected cart. Now it returns, for each channel, which carts the channel is available for and how many buyers have no email or phone number. The backend developer agreed and built this structure. Thanks to it, the merchant sees right in the form how many buyers won’t get the message.

We chose not to build an action that selects all of a store’s carts at once. A store can have tens of thousands of carts. Collecting data for all of them would take a series of requests over several minutes, and the server might not cope with sending messages to all those buyers at once. So the merchant selects carts on the current page and can add carts from other pages to the selection.

### Templates are edited as code, with a preview

Messages to buyers are built from Liquid templates. Liquid is a template language that inserts the buyer’s name, products, quantities, prices and links into the text. At first, email templates were edited in TinyMCE, a visual editor, and it broke Liquid code, especially loops and variables inside the table-based layout of emails. TinyMCE encoded some characters and cut tags and attributes, and after that the server could no longer turn the saved text back into a Liquid template.

I suggested replacing the visual editor with a source code editor with a Preview button, as in the Settings → Email templates section. The product manager supported the idea, and on 28 February 2025 we decided to switch to the code editor. On 5 March, I suggested doing the same for SMS and messengers, because their templates also contain Liquid variables and also need a preview. In the end, all channels got the code editor, so the team didn’t have to support several different editors.

I integrated the shared [Monaco-based editor build](/work/monaco-editor/) that I had worked on in a separate project. In Abandoned Carts, my part was to add it to the settings and the send form and to build template selection, a way to restore the default text, and the preview. For email, the editor supports HTML with Liquid; for SMS and messengers, text with variables. The template is saved exactly as the merchant wrote it.

The preview asks the server for the template filled with a specific cart’s data. For email, it shows the finished email with the subject, products and total; for SMS and messengers, it opens in a compact dialog. So the merchant checks not only the template code but also the data that goes into it. The preview doesn’t send anything to the buyer.

![Preview of the email “You forgot something...”: a greeting with the buyer’s name and a product from the cart with its price, with the message form and template code behind it](/images/work/abandoned-carts/email-preview-with-cart-data.webp)

### A message shows the cart as it was when the message was sent

Every message the merchant sends or tries to send goes into the communication history. It shows when and through which channel the merchant wrote to the buyer, how sending was started and how it ended. The history separates the statuses "not sent", "error" and "sent". Messages for the current and earlier versions are in one history, so the merchant sees the whole conversation with the buyer.

A message is linked to a specific cart version. If the buyer changed the products after a reminder, the message shows the cart as it was when the message was sent, not as it is now. Showing the current version there would distort the history of the conversation with the buyer.

In February 2025, we worked out how to open a version from the communication history. A message may refer to earlier cart contents, and one version may have several messages. So the link in a history entry opens the products of the version the message was sent for. Thanks to this, when the merchant writes to the buyer again, they don’t have to guess what they have already sent.

### Access has more than two states

The section has several access states: not enabled yet, trial running, trial ended, or subscription active. I built the section’s initial state: a description of what it does, a button to start a trial and a Connect button for the paid subscription. The subscription costs about $12 a month.

![Initial state of the Abandoned carts section: an illustration, a short description and the Try it for free and Connect buttons](/images/work/abandoned-carts/access-start-trial-or-connect.webp)

The trial gives 7 days and 100 messages. After it starts, the interface shows how many days and messages are left.

![Trial banner showing 100 messages and 7 days remaining, with a Connect button](/images/work/abandoned-carts/access-trial-limits.webp)

For the frontend, a single "has a subscription" flag wasn’t enough. The server returns whether the store has access to the section, the trial state and end date, overdue payments, invoices, the price and the remaining limits. The banners, buttons, settings and whether the store can keep working all depend on this data. When access changes, the interface updates right away: for example, after the trial starts, the Settings button becomes available.

### The section works on mobile and uses shared components

I adapted the tables, filters, analytics and drawers for mobile screens: I changed the layout of the product row and the placement of buttons, and moved some actions into a menu.

For this section, I improved shared components in the UI kit, inSales’s library of interface components: the date picker, the filter, the table and the tooltips of analytics cards. The improvements went into the library itself, not into local copies inside the section that would be incompatible with it.

### The section went through review and QA testing before release

I prepared the section for review and wrote test cases for QA: closing the drawer during a request, repeated search, an empty selection, a date range, products with options, the link between a cart and an order, missing contacts, the channel state and the Liquid template preview. By 16 December 2024, QA had found more than 40 bugs, and they were fixed before the release. The section went to production on 31 March 2025, and I finished the frontend fixes in April.

## Results

- The section went to production on 31 March 2025. In the first week, before the announcement in the inSales Telegram channel on 14 April, 11 stores paid for it.
- By September 2026, the section had more than 200 active paid subscribers.
- The merchant sees in one place who left a cart, what was in it and how it changed, and writes to the buyer manually, in bulk or automatically.
- Before the release, in February 2025, the manager responsible for the product interviewed one of the stores. The store said that reminders clearly help bring a buyer to an order, and said the results were worth the price.
- In a [case study from 20 May 2025](https://www.insales.ru/blogs/cases/hited), inSales reports that retargeting linked to abandoned carts brings the Hited store about $1,250–4,400 a month. It also reports that 15% of customers come back and complete a purchase.
