# 07 — Release 1.0.1 published and verified

Historical **site:** [Sites snapshot](https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/) · [CMS](https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/admin/). Current production is [Vercel](https://anu3ev-com.vercel.app/).

Published [v1.0.1](https://github.com/Anu3ev/anu3ev.com/releases/tag/v1.0.1), commit `6541daa29fb14356337f354cb4e75751d19afc3f`. The successful [master run](https://github.com/Anu3ev/anu3ev.com/actions/runs/39355732251) ran 43 unit and 49 browser tests and created the archive. Sites received **that exact CI export**, with GitHub ZIP/Release SHA256 and all 367 file hashes checked. No post-test rebuild. Source HEAD matched; saved Sites version 3 deployed successfully.

| Check | Actual result |
| --- | --- |
| Public guest access | Chrome and Playwright API 200, no login, matching version/commit |
| Production browser/axe | 49 passed, zero skipped/flaky, one worker |
| Canonical/sitemap | All 28 HTML URLs returned 200 without redirects |
| Unit / V8 | 43 passed, 100% in twelve selected pure modules, not all UI |
| Fallow core | Zero dead code, cycles, boundaries, complexity or clones |
| Public mobile Lighthouse | 92/100/81/100; LCP 2.4 s, CLS 0, TBT 40 ms |
| Screenshot inspection | Desktop and RU mobile viewed, no overflow at 375 px; actual mobile reference fidelity remained unverified |

[Review and limits](review.md) · [provenance](reports/provenance.json) · [browser](reports/production-browser.json) · [Lighthouse](reports/lighthouse-mobile.json) · [dependencies](../06-editable-pages/dependencies.md).

Automatic hosting integration was unresolved here; [task 08](../08-github-deployment/summary.md) later connected Vercel to GitHub. The old Sites snapshot is not the current deployment target. The custom domain is required after remaining site changes; [operations](../../operations/deployment.md).

The owner performs first personal-token CMS sign-in/write. The optional successful-job rerun was not executed after automatic review rejection; tag/asset checks were read-only. No field INP/CrUX or independent code review was performed. Remaining tooling advisories were not hidden and the complete original goal was not marked achieved at this stage.
