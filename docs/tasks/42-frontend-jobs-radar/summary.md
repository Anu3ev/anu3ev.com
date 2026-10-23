# 42 — Frontend Jobs Radar case

From the external portfolio review: everything on the site was past work. The owner chose the case to add: FlowUp is still in progress and too early to show, and Vue Job Radar (his personal feed) isn't as good as he'd like. The public **Frontend Jobs Radar** channel, built on the same service, is live and publishing.

**Sources and truth gate.**
- The `tailor-alexander-resume` entry for this project, which lists what is established and what must not be claimed (no perfect matching, uptime, subscriber counts or hiring outcomes).
- The owner's LinkedIn posts of 23 and 25 September 2026.
- The project diary.
- The channel's public archive, read on 23 October 2026.

Where the September 23 post and the later diary disagree, the diary wins. The plain-post fallback described in the post was replaced on 25 September by AI-only publication with a queue and a $3 monthly budget. JEV's maker was checked: typesafe.ai describes Jev. The repository is private, so the case links only to the channel.

**Results in the case.**
- **32 of 34** days with new vacancies since the channel opened on 20 September 2026, counted from the public archive; the two gaps are Sundays.
- **≈$0.00008** per JEV check of about 2,000 input tokens, from the owner's post.
- **20** Telegram channels in the collector, from the diary.

The case also says plainly that filtering isn't perfect. While picking the cover, the archive showed a non-frontend role ("ML Platform Engineer", post 423) that had got through.

**Images.** The cover is a real 2× capture of one public post (Senior Frontend Engineer (Vue.js), The Hague), cropped to leave out the subscriber and view counts. The Russia-only Angular/C# post on the same page was skipped as a weak example.

**Placement.** The case sits 4th in the portfolio, as the first non-inSales work after the open-source engine. Later cases moved down by one. It adds a new filter category: "Side projects" / «Личные проекты».

**Stack.** This project isn't on LinkedIn, so its skills come from the sources: TypeScript, Cloudflare Workers, Cloudflare D1, JEV, AI Integration, Telegram Bot API. If the owner adds it to LinkedIn, the site should copy LinkedIn's order, as for the other cases.

**Tests.** The case pages are covered by the site-wide checks (sitemap, accessibility, external links). `case-links.spec.ts` also checks that both language versions link to the live channel in a new tab.
