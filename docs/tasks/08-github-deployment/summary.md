# GitHub deployment

Project `anu3ev-com` in the existing Vercel Hobby workspace is connected to `Anu3ev/anu3ev.com`. Production: **https://anu3ev-com.vercel.app/**. CMS: **https://anu3ev-com.vercel.app/admin/**.

The first import deployed master `3020b2779bf6aafe051fb8938295b078452971e0` as version 1.0.1. Guest Chrome and unauthenticated requests confirmed public access, the production canonical, SEO endpoints and HTTP 404. The GitHub App retains its two prior repository selections and adds only this repository.

The automatic path is verified: [PR #8](https://github.com/Anu3ev/anu3ev.com/pull/8) merged as `fa42abdfce3f70aadfc1b83cef16646c45f2e04e`; Vercel published version 1.0.2 without a manual deployment. [GitHub Release v1.0.2](https://github.com/Anu3ev/anu3ev.com/releases/tag/v1.0.2) points to the same commit. Its archive is uploaded and has SHA256 `544f42e1281c0b20fb2d12a0780b8c548f700afb0d4371504276aef8109cc4ed`.

Local content/lint/types/43 unit tests and the static build passed. [PR CI](https://github.com/Anu3ev/anu3ev.com/actions/runs/39394895204) and [master CI/release](https://github.com/Anu3ev/anu3ev.com/actions/runs/39395386920) passed. The public Vercel site then passed all 49 automated browser/axe/SEO/navigation checks, with zero failures, skips or flaky tests and one worker. [Production report](reports/production-browser.json). All 28 sitemap URLs returned 200 without redirects; the CMS entry loaded and unknown routes returned 404.

A provider-specific header check found that `/admin/:path*` covered CMS assets but missed the `/admin/` entry. [PR #9](https://github.com/Anu3ev/anu3ev.com/pull/9) changed the matcher to `/admin(.*)` and published [1.0.3](https://github.com/Anu3ev/anu3ev.com/releases/tag/v1.0.3), commit `d073e5b8101123a451dd900a09f88b068017da40`. The guest production check confirmed `no-store` and `noindex, nofollow` on the entry, configuration and bundle. [Master CI/release](https://github.com/Anu3ev/anu3ev.com/actions/runs/39396542260) passed; the Release tag and public version matched.

No paid services were enabled. The custom domain still needs DNS access; the Vercel HTTPS address works independently. [Operating guide](../../operations/deployment.md), [review and limits](review.md), [plan](plan.md).
