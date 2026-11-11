---
title: "Frontend Jobs Radar: a job channel with a cheap AI check before every post"
description: "A TypeScript service on Cloudflare Workers that collects frontend job listings, finds the originals, checks each one with Jev and posts short English summaries to a public Telegram channel. New roles appeared in the channel on 32 of 34 days since launch."
locale: en
slug: frontend-jobs-radar
published: true
cover: /images/work/frontend-jobs-radar/channel-post.webp
coverAlt: "A Frontend Jobs Radar post: Senior Frontend Engineer (Vue.js) at Dyflexis in The Hague, with the role, requirements, publication date and links to the job listing and to Arbeitnow, the board where the service found it"
category: Side projects
year: Sep 2026 – present
context: Side project
role: "Designed, built and run it: collecting job listings, filtering, AI checks, publishing and operations"
stack: [TypeScript, Cloudflare Workers, Cloudflare D1, Jev, AI Integration, Telegram Bot API]
featured: false
order: 4
results:
  - value: "32 of 34"
    label: days with new roles in the public channel, 20 Sep – 23 Oct 2026
  - value: "≈$0.00008"
    label: per Jev check of about 2,000 input tokens
  - value: "22"
    label: Telegram channels in the collector, alongside career pages, ATS platforms and job boards
---

## The problem

Looking for a Vue role in 2026 meant seeing the same job listings on several boards, outdated listings, scams and promotions, and listings that mentioned Vue once and were really about something else. Checking all these boards by hand is tiring, so I wanted to automate the search and get only the roles worth my time.

The same boards also carry React, Angular and other frontend roles. They don’t fit me, but they could fit someone else. So the service runs two feeds: a narrow personal feed for my own search, and a public Telegram channel, [Frontend Jobs Radar](https://t.me/frontendjobsradar), for frontend roles in general.

## My role

This is a side project I started in September 2026, after leaving inSales. I designed, built and run it on my own: collecting job listings, filtering, the AI checks, publishing, the database and releases.

## What I built

Every job listing takes the same path from a board to the channel.

![The publication path: job boards, career pages, ATS platforms and 22 Telegram channels, then finding the employer’s page and removing duplicates, rules for age, location and stack, the Jev check, a short English post from a language model, text checks, and the channel, which gets at most one post every five minutes. If the budget is used up or the text fails the checks, the listing waits in the queue](/images/work/frontend-jobs-radar/publication-pipeline.svg)

### The service looks for the original listing, not an aggregator’s copy

A TypeScript service on Cloudflare Workers with a D1 database collects job listings on a schedule from company career pages, ATS platforms and job boards. ATS platforms such as Greenhouse and Lever are where companies publish their roles and receive applications.

Job listings are also posted in Telegram channels. A Telegram bot receives a channel’s messages only if it is an admin of that channel. So other people’s channels are read by a separate collector: it runs in its own worker and signs in to Telegram with a separate account. The session of that account is stored encrypted. Once a day the collector reads 22 channels: up to three pages of 100 messages from each channel per run, within Telegram’s rate limits.

The same role appears on several boards, often through aggregators, and an aggregator can show an old listing as a new one. So the service looks for the original listing: it follows the apply link to the employer’s page on an ATS platform and checks the publication date, the full description and the requirements there. For example, a listing that looked new on an aggregator had been published on the employer’s page in April 2022. Listings older than 14 days go no further, and the service removes duplicates from different boards.

In my personal feed, such a listing shows that the original was found on an ATS platform and verified. The card also shows the publication date and a link to the original.

![A job card in the personal feed: (Senior) Frontend Engineer at chargecloud GmbH, Cologne, remote, priority 100, the Official ATS, Verified, Vue.js, Nuxt.js and TypeScript labels, the publication date of 18 September 2026 and a Primary source link to the original](/images/work/frontend-jobs-radar/personal-feed-vacancy-card.webp)

Like the Telegram collector, the service checks only a limited number of originals per run, so the rest wait in a queue in D1 until the next run.

### Keywords weren’t enough, so Jev checks the listings

At first, listings were selected by keyword rules. But a real frontend role can miss the expected words, and an irrelevant post can mention "frontend" somewhere in the text. So each listing also goes through [Jev](https://typesafe.ai/), a cheap model from TypeSafe AI that decides whether a text meets given criteria. One check of about 2,000 input tokens costs about $0.00008, which is about eight cents per thousand checks. With a general-purpose LLM, checking every listing this way would be too expensive.

The model gets different questions for each feed. For the public channel, it checks whether this is really a frontend role and whether the listing has enough detail. A role that doesn’t fit me can still be right for someone in the channel, so my own requirements don’t apply there.

In the personal feed, Jev checks only borderline roles: the ones a broad Vue and Nuxt search catches but the narrow filter for my requirements would drop. I added this after the narrow filter dropped a role because of its job title, even though its description named Vue and Nuxt directly. For these roles, the model decides whether they are worth my time, and it checks at most two of them per run. Jev checks in both feeds share a limit of $1 a month.

### A model writes the posts, and a listing without a checked text waits in the queue

Job listings come in different languages, such as Russian, German and Swedish, but every post in the channel is in English and has the same format. So when a listing passes the Jev check, a separate language model writes a short English post about it: the role, stack, location and work arrangement, plus salary and hiring restrictions when the listing has them. The post ends with a link to the job listing and a link to the board where the service found it, because some boards allow reposting their listings only with that link. Before publishing, the text goes through automated checks: the Telegram markup is valid, the text is in English, and every fact is in the original listing.

At first, the service published template posts built straight from the listing text. On 22 September I reviewed the latest posts in the channel and found cut-off words, HTML entities, empty lines and companies’ boilerplate about themselves. The same day I added the model, but kept a fallback: if the model went over budget or its text failed the checks, a template post went out instead. On 25 September I removed that fallback. Now a listing without a checked text waits in the queue instead of going out as a template post.

The model that writes posts has a limit of $3 per calendar month. The provider reports the exact cost of a call only after the response, so the service reserves the maximum cost before the call and replaces the reservation with the actual cost after it. If a call is interrupted and it is unclear whether the provider charged for it, the reservation stays, and the request isn’t sent again automatically. When the budget runs out, listings wait in the queue too.

### Every listing goes out to the channel once

Every five minutes, the service publishes at most one new post. If a role is closed or a post needs a fix, the bot edits the existing message instead of sending a new one. If Telegram’s confirmation is lost, the post may already be in the channel, so the service doesn’t send it again, and I check such cases against the channel history. This keeps duplicates out of the public channel.

The service uses the publication history in D1 to know which listings have already gone out. So before a database migration, I back up the database and run the migration on a full copy first. This way, a mistake in the migration shows up before it can touch the publication history in the live database.

## Results

- From the launch on 20 September to 23 October 2026, new roles appeared in the channel on 32 of 34 days.
- My personal feed gets only roles with a verified original no older than 14 days; Jev also checks the borderline ones.
- A Jev check costs about $0.00008, so the model checks every listing before it is published to the channel.
- The filtering isn’t perfect: an occasional non-frontend role still gets into the channel, and I keep adjusting the boards and the questions to the model.

## Where to see it

The channel is public: [t.me/frontendjobsradar](https://t.me/frontendjobsradar). The source code is private.
