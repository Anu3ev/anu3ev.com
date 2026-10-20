# 05 — CI, releases and initial public site

Historical publication: [Sites snapshot](https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/). Current production is [Vercel](https://anu3ev-com.vercel.app/), with automatic deployment established in [task 08](../08-github-deployment/summary.md).

GitHub Actions checks PR/master content, lint, types, unit tests, SSG, Chromium/axe and actual pagination. A higher version creates an immutable semver tag, Release and the exact tested archive with minimal permissions. Official actions are SHA-pinned; Node 24/pnpm are pinned; reports are retained for three days. Confirmed [Release v1.0.0](https://github.com/Anu3ev/anu3ev.com/releases/tag/v1.0.0), archive 6,250,319 bytes, target `ea514c4c92660b3b810a62b0195fbec8fb8ccd62`, and successful [master run](https://github.com/Anu3ev/anu3ev.com/actions/runs/39347611965).

Preserved Sites identity in `.openai/hosting.json`, verified source HEAD and published two saved versions using native tools. GitHub remained private. Hidden stdin/environment carried credentials; no git add was used. [Staging conflict and hosting decision](hosting.md).

Production exposed search/history races and an empty input on direct query URLs. URL became the single filter owner, with initial parameters applied after hydration; added reload/noindex/hydration regression coverage. Privacy reflected the actual host and technical cookies.

## Checks at this stage

- `pnpm check` and SSG passed; 34 unit tests and 100% coverage in eleven selected pure modules.
- [Corrected GitHub run](https://github.com/Anu3ev/anu3ev.com/actions/runs/39346726243): 34 unit and 48 browser tests passed.
- Public corrected version: **48 passed, zero skipped**, one worker, both locales/themes, mobile, no-JS HTML, CMS login, all sitemap URLs, actual 404, direct search reload and pagination.
- Official actionlint 1.7.12 passed. Fallow core findings were zero; CSS/conditional-skip heuristics were reviewed separately.
- Public mobile Lighthouse: **93/100/81/100**, LCP **2.4 s**, CLS **0.004**, TBT **30 ms**. The provider's Cloudflare script caused the deprecated-API finding. Local task-04 measurements were not presented as production results.

The first production run had 46 passed and one failed, followed by a correction and full rerun. [Initial run](reports/first-production-browser-run.json), [Lighthouse](reports/lighthouse-production.json), [review](review.md). Results are laboratory measurements, without field INP/CrUX.

At this historical stage, Vercel 403 blocked automatic hosting updates; Sites was a manually published snapshot. A Google account did not match the existing Vercel user, so no duplicate account was created. The owner later completed authorization and task 08 resolved that limitation. Zomro DNS and the first personal-token CMS write were not changed here. No independent review was performed and the entire original goal was not marked complete.
