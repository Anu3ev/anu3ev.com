# CI and release review

Requirements: free GitHub checks, versioned releases with the tested build, one browser worker, no credential leakage and a separate reviewable task.

The first pass found that `gh api ... || true` hid authorization/network errors as well as missing tags. Replaced it with a successful matching-refs request so API failures stop the job. Existing tags resolve through `/commits/:ref`, including annotated tags. A version cannot move to a different commit; the same commit is idempotent.

Reviewed fork/PR permissions, artifact naming between jobs, parent comparison fetch depth, failure reports and short retention. No pull_request_target, custom PAT, token printing or npm publication. Checkout uses `persist-credentials: false`; only the Contents-write release job receives its token.

Initial `pnpm check`: 31 unit tests passed with full coverage in ten selected pure modules. Release tests cover equal versions, patch/minor/major increments, numeric ordering, downgrade, prereleases, invalid previous versions and multiline output injection. Official actionlint 1.7.12 passed after SHA256 verification. Fallow 3.34.1 found no dead code, cycles, boundaries, complexity or clones.

The second pass compared YAML with official action definitions and commit references; pnpm's annotated v4 tag was resolved to a commit SHA. A real GitHub run was checked before merge. Existing CSS/conditional-skip limits from task 04 were retained. This was self-review.

Production then exposed two related search problems despite local CI: results could precede query navigation, and a direct static query URL left the native input at its empty SSR value. Removed independent filter refs/watchers; URL owns state. Updates preserve the listing's actual trailing-slash pathname. A hydration-ready flag synchronizes input and results after static HTML. Three targeted scenarios passed, followed by all **48 public browser tests** and a real GitHub run. Origin tests increased unit coverage to 34 tests across eleven selected pure modules.

Privacy described the actual Sites/Cloudflare host at this stage, including technical protection cookies. Lighthouse Best Practices 81 came from deprecated APIs in the provider's `/cdn-cgi/challenge-platform/scripts/jsd/main.js`, absent from app source. Protection was not disabled and warnings were not suppressed. [JavaScript Detections](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/), [Cloudflare cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/). Current hosting/privacy moved to Vercel in task 08.
