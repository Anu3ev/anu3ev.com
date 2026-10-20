# External navigation review

Audited profile/sidebar/contact anchors, project actions and Markdown links. Known external profile destinations now use native `_blank` anchors with `noopener noreferrer`. Markdown and project actions share `getLinkNavigation()`, which resolves the complete target/rel pair against the validated canonical origin. Relative routes, anchors, email actions and future same-site playground URLs keep their existing context. Explicit authored internal targets and relationship tokens remain supported.

The helper classifies navigation; it is not an HTML/URL sanitizer. Existing content validation still rejects unsafe content. A malformed editorial URL cannot crash SSG while being classified. Returning both attributes from one owner avoids separate target/rel decisions in nested Vue markup.

The audit found a literal email in Privacy. It now reads the same profile field as Contacts, so a CMS profile change updates both destinations. A related-place search found no remaining literal profile email in application code.

## Findings and corrections

The new browser regression first failed against public **1.0.7** on the missing `_blank` attribute of the Home GitHub link. The same invocation passed all four design/navigation checks. [Exact previous-version result](reports/public-before.json); it is not presented as an all-green run.

The first implementation placed URL classification in a Vue computed value. Fallow reported its uncovered CRAP risk. Moving the pure policy to a tested utility exposed a second finding: repeated target/rel conditionals raised the case template's cognitive score to 24. The final helper returns both attributes, consumed through native `v-bind` by the two renderers. No suppression or metric-only condition rewrite was used. Eight unit scenarios cover schemes, relative/absolute URLs, ports, malformed/missing inputs, authored targets and relationship preservation.

## Verification

- `pnpm check` passed content, ESLint, types and **51 unit tests**. Actual V8 coverage is complete in thirteen selected pure modules, including the navigation policy, not the entire UI.
- Static generation passed after the final helper contract. The complete final browser/axe suite passed **56 tests, zero skipped/flaky**, one worker. The new test audits anchors on all 28 published routes and checks a native popup with a null opener.
- The automated popup destination is a fulfilled document, so CI does not depend on GitHub availability. Separately clicked the actual GitHub contact link in the MCP browser without interception: a new tab opened at `https://github.com/Anu3ev`, Contacts stayed open and `window.opener` was null. Closed only the created tab. [Manual result](reports/manual-popup.json).
- [Final Fallow](reports/fallow.json), using explicit real coverage, passed with zero changed-code dead-code, complexity or duplication findings.

Reviewed the final helper, its two consumers, every explicit external profile anchor and the Privacy binding, then repeated content/code/build/browser checks. This was author self-review. It does not verify authenticated CMS writes, every third-party service's future availability or an independent security/accessibility audit.
