---
title: From abandoned carts to a useful merchant workflow
description: Analytics, filters, deep-linked cart details, communication history, and subscription states in one Vue product. Frontend ownership from API discussions through release.
locale: en
slug: abandoned-carts
published: true
cover: /images/abandoned-carts.webp
coverAlt: The inSales abandoned-cart analytics screen shown with its original empty data
category: Product engineering
year: 2024–2025
role: Frontend delivery and technical requirements
stack: [Vue, JavaScript, Vue Router, ApexCharts]
featured: false
order: 4
---

## Make incomplete purchases actionable

The inSales abandoned-cart product lets merchants inspect a cart, understand its changes, review previous communications, and send a message or configure automatic reminders. Analytics, the cart table, detail drawers, message templates, and commercial access belong to one workflow.

I owned the frontend, working with a backend engineer, product manager, designer, and QA. The main delivery period was October 2024 through April 2025, alongside other product work. Starting from designs, I formalized entities, states, edge cases, and JSON contracts for each section.

## A cart is a history, not a single row

The product distinguishes a cart session, snapshots of its contents, the latest version, a resulting order, and communications attached to that history. Without a shared model, the table, analytics, and detail drawer can describe different things while appearing to show the same cart.

I worked through that model with backend and product, then connected it to filters, navigation, and the detail interface. Date ranges and selection state belong in URLs so a view can be revisited or shared rather than reconstructed manually.

## Access has more than two states

A single subscribed/not-subscribed flag was insufficient. The interface handles trial access, expiry, unpaid access, invoices, price, and message limits. Those states affect banners, buttons, payment, and communication settings.

Payment UI is created when its dialog opens, so a hidden component does not begin its own operations. Activating a trial updates the available actions immediately.

## Ownership and limits

I delivered analytics, tables, filters, cart details, communication flows, QA scenarios, and release preparation. Server storage, calculations, and sending were implemented by the backend engineer.

The current source notes record more than 200 active paid subscribers at the time the figure was confirmed. That is a product adoption figure, not a count of all website visitors or a claimed revenue uplift caused by my frontend work. The screenshot retains its original empty data; no example performance numbers were added to it.
