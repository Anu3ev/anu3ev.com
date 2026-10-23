---
title: "Frontend Jobs Radar: a job channel with a cheap AI check before every post"
description: A TypeScript service on Cloudflare Workers that collects frontend vacancies, checks each one with JEV and posts short English summaries to a public Telegram channel. New roles went out on 32 of 34 days since launch.
locale: en
slug: frontend-jobs-radar
published: true
cover: /images/work/frontend-jobs-radar/channel-post.webp
coverAlt: "A Frontend Jobs Radar post: Senior Frontend Engineer (Vue.js) at Dyflexis in The Hague, with the role, requirements, publication date and links to the vacancy and its source"
category: Side projects
year: Sep 2026 – present
context: Side project
role: Sole developer, from collecting sources and filtering to AI integration, publishing and operations
stack: [TypeScript, Cloudflare Workers, Cloudflare D1, JEV, AI Integration, Telegram Bot API]
featured: false
order: 4
results:
  - value: "32 of 34"
    label: days with new vacancies in the public channel, 20 Sep – 23 Oct 2026
  - value: "≈$0.00008"
    label: per JEV relevance check of about 2,000 input tokens
  - value: "20"
    label: Telegram channels in the collector, next to career pages, ATS platforms and job boards
---

## The problem

Looking for a Vue role in 2026 meant reading the same listings on several boards, scrolling past outdated posts, scams and promotions, and opening vacancies that mentioned Vue once and were really about something else. I wanted the search itself to be automated, so that I only read roles worth reading.

The same sources also carry React, Angular and other frontend roles that don't fit me but could fit someone else. So the project has two outputs: a narrow personal feed for my own search, and a public Telegram channel, [Frontend Jobs Radar](https://t.me/frontendjobsradar), for frontend jobs in general.

## My role

A side project I started in September 2026, after leaving inSales. I designed, built and run it on my own: sources, filtering, the AI checks, publishing, the database and releases.

## What I built

### Collection and original sources

A TypeScript service on Cloudflare Workers with a D1 database collects vacancies on a schedule from company career pages and ATS platforms, job boards and Telegram. The Telegram collector is a separate worker. It reads 20 configured channels, keeps its session encrypted, and handles pagination, rate limits and work that has to resume after an interruption.

Collecting turned out to be the smaller part. The same job appears on several boards, often through aggregators, so the service looks for the original listing, removes duplicates and keeps a link to the source. Work that can't finish in one run goes through durable queues instead of being dropped.

### Two filters for two audiences

Keyword rules were not enough. A real frontend role can miss the words I expect, and an irrelevant post can mention "frontend" somewhere in the text. So before a vacancy goes out, [JEV](https://typesafe.ai/), a small and cheap model from TypeSafe AI built for this kind of decision, answers one yes-or-no question about it. For the public channel the question is: is this actually a frontend job, with enough detail to be useful? For my personal feed it is a different one: is this worth my time? A role that doesn't fit me can still be right for someone in the channel.

### English posts within a budget

When a vacancy passes, a separate language model writes a short English post with the role, stack, location, work arrangement, and salary or hiring restrictions when the listing has them, plus links to the vacancy and its original source. Generated text goes through automated checks before publishing: valid Telegram markup, English, and facts that the source actually contains.

The public channel's AI spending has a hard budget of $3 per calendar month. Each call reserves its maximum cost before it runs, and the reservation is settled from the usage the provider confirms. If the outcome is unknown, the reservation is kept instead of the call being retried blindly. When the budget runs out or a post fails validation, the vacancy waits in the queue instead of going out as unedited text.

### Publishing without duplicates

Posts go out on a schedule. The bot can edit an existing message, for example when a vacancy is withdrawn, and it sends me daily and weekly reports. If Telegram doesn't confirm a delivery, the service doesn't simply send again, because a duplicate post in a public channel is worse than a delayed one. Database changes are rehearsed on a fresh backup first, and schedules are paused and restored around releases.

## Results

- The public channel has published new vacancies on 32 of the 34 days since it opened on 20 September 2026, counted from its public archive on 23 October 2026. Both gaps are Sundays.
- One JEV relevance check of about 2,000 input tokens costs about $0.00008, roughly eight cents per thousand checks. That made a model check practical on every vacancy, where a general-purpose LLM would have been too expensive.
- The filtering isn't perfect: an occasional non-frontend role still gets through, and I keep adjusting sources and questions.

## Where to see it

The channel is public: [t.me/frontendjobsradar](https://t.me/frontendjobsradar). The source code is private.
