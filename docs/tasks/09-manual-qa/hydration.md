# Production follow-up: early interaction

The first 1.0.4 production smoke exposed a case that the normal local suite had missed: clicking a portfolio filter immediately after document load could happen before Vue attached its handler. The URL stayed unchanged. A controlled production check after `networkidle` worked, confirming the readiness boundary rather than a broken category query.

Two new tests hold the actual `/_nuxt/*.js` requests while inspecting the server-rendered controls. Both failed before the fix because buttons appeared enabled without their client handlers. They then release the requests and verify that filtering, typing, URL updates and the theme toggle actually work. The gate uses a native Promise handle with deterministic cleanup, not a sleep or private Vue state.

Patch **1.0.5** reuses the existing filter readiness flags to disable both topic groups and the search input until mount. Busy state is exposed on the toolbars. The analogous theme toggle uses an unknown initial preference and stays disabled until it reads the prepainted browser theme. Ordinary native links and disclosure remain usable. Disabled styling does not change layout dimensions.

The search scenario now clicks the actual control before sequential typing, allowing normal native actionability checks to wait for readiness. This is accompanied by the separate delayed-JavaScript tests, so it does not hide the original early-interaction case.

Validation: content, ESLint, TypeScript, **43 unit tests**, static export and the complete **52 browser tests** passed. No failures, skips or flaky results; one browser worker. [Browser result](reports/hydration-browser.json). The two filter-only delayed-script checks first passed, then coverage was extended to the analogous theme toggle and the complete suite was rerun.

[Fallow](reports/hydration-fallow.json) exited 0 with a warn verdict: no dead code, cycles, boundary or complexity findings. It reports one 51-token/17-line native topic-button markup clone across blog/portfolio after the new disabled attribute crossed the detector threshold. The two pages have different toolbar containers; a new abstraction solely to remove this small markup clone would broaden the fix and risk a layout change. The duplication is explicitly retained, not suppressed or reported as zero. Existing CSS heuristic warnings remain.

Self-review covered every own `@click` button: blog filters, portfolio filters and ThemeToggle. The native mobile disclosure and ordinary links were checked separately. The corrected tests release their network gate and remove routes in `finally`. A code-writer lesson about SSR readiness was synchronized and validated in both source and installed copies.

This follow-up remains part of manual QA. English repository documentation, actual MagicPath design corrections and finally the custom domain follow in the user's requested order.
