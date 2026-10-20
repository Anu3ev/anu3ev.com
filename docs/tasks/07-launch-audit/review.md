# Published release review

Reviewed actual publication, not only a local build. Master/Release 1.0.1 matched the GitHub ZIP digest, inner Release tar digest, version endpoint and source remote HEAD. All **367 public-file hashes** matched after Sites packaging; only the required manifest was added. Paths and symlinks were checked before extraction.

Fresh guest Chrome and Playwright API requests returned 200 without login or owner bypass. An initial Python urllib probe received Cloudflare 403/1010, a confirmed provider browser-signature restriction rather than private audience. Platform protection was not disabled. [Cloudflare 1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/), [Browser Integrity Check](https://developers.cloudflare.com/waf/tools/browser-integrity-check/).

A separate web-fetch tool could not open this address. The successful browser test did not replace that unavailable check or establish Google indexability. Search Console/indexing were not checked; public browser access and technical metadata were verified.

The full public suite had **49 passed, zero skipped/flaky**, one worker. All 28 sitemap URLs returned 200 with `maxRedirects: 0`. Metadata, locales, themes, reflow, keyboard/menu/focus, no-JS HTML, search/Back/reload, CMS configuration and Privacy date agreed. An isolated real SSG fixture verified 10 + 2 articles, page-two reload/search and RU switching without publishing fake articles.

Desktop and Russian mobile screenshots were inspected, with no overflow at 375 px. [Desktop](home-public-desktop.jpg), [mobile](home-public-ru-mobile.jpg). This checked the initial implementation, not fidelity to the later supplied mobile reference; task 11 addresses that gap.

Final public mobile Lighthouse: **92/100/81/100**, LCP 2.4 s, CLS 0, TBT 40 ms. The weighted Best Practices finding was deprecated APIs in Cloudflare's challenge script, not app source. It was not hidden or described as a perfect score. These are lab measurements; field INP/CrUX were unavailable.

Automatic approval review rejected an optional rerun of an already successful publish job because it could mutate Release/assets again without separate explicit authorization. No bypass/retry was attempted. Existing tag SHA, asset uploaded state/size and SHA256 were checked read-only; that is not a real rerun. The initial publish workflow succeeded and created the correct release.

At this historical stage Vercel create-project still returned 403, no CLI credentials existed, the available Google account did not match the Vercel user, and GitHub web sign-in was unavailable. No duplicate accounts or administration-scope workaround were created. Zomro DNS remained unchanged. The owner subsequently authorized browser access and task 08 resolved hosting integration.

The entire original goal was not marked complete: the snapshot/CI/Release worked, but automatic hosting updates were then unresolved. Personal-token CMS writes were not performed; tooling advisories and automated-accessibility limits remained documented.
