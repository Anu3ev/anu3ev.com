# Dependency review

The initial `pnpm audit --json` reported six high and one moderate advisories. Four available fixes were applied: Sharp **0.34.5 → 0.35.5** and compression **1.8.1 → 1.8.2**. A normal update did not fix compression because Nuxt CLI → serve pins its old version; `pnpm-workspace.yaml` therefore has a targeted `serve>compression` override.

Sharp processes SVG/WebP/social images at build time. Its patch addresses libvips/libheif/librsvg issues: [libvips](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Compression fixes a leak on prematurely closed responses: [advisory](https://github.com/advisories/GHSA-vc2v-76pw-4v95).

The repeat audit reported **two high and one moderate**, zero critical, exit code **1**, not a pass. No patched published versions were available at that check:

| Package / advisory | Actual dependency path and scope |
| --- | --- |
| node-forge 1.4.0 · [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) | Nuxt → nitropack → listhen, TLS/dev-server tooling. The public export has no Node server; local dev binds HTTP 127.0.0.1. |
| braces 3.0.3 · [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | Nuxt Content → micromatch, build-time matching in dist/module.mjs. Config owns globs, slugs use an allowlist and visitor search never enters the glob parser. |
| sprintf-js 1.0.3 · [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) | gray-matter → js-yaml → argparse, CLI formatting. The publication reader explicitly uses YAML 1.2 and never invokes the js-yaml CLI. |

This classifies current usage, not all possible risks. Advisories were neither hidden nor excluded from audit. Apply patches when available, and reassess before enabling a server runtime or new untrusted inputs. Installation also reports inherited Nuxt peer/deprecation notices; passing lint/types/SSG does not mean those notices do not exist.

Frontmatter was checked separately. The legacy parser converted an ordinary ISO date into JavaScript Date, violating the string contract. The reader uses `yaml` 2.9.1; BOM/CRLF and unquoted dates have unit and real Nuxt-fixture coverage. Tagged JavaScript is rejected **before** selecting gray-matter's executable engine. Reader metadata remains `unknown` until Zod validation.

Sveltia remains pinned/self-hosted at 0.248.1, with MIT license copied to `/admin/LICENSE.txt`. Local Inter includes `public/licenses/Inter-OFL.txt` from the pinned Fontsource 5.3.0 package.
