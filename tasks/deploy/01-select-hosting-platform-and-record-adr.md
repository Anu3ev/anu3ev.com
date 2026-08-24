# DEP-01: Select the Hosting Platform and Record an ADR

**Status:** Planned  
**Depends on:** BE-01

## Objective

Select a hosting platform from current evidence rather than convenience or brand familiarity.

## Deliverables

- Comparison of current Cloudflare, Vercel, and Netlify support for Nuxt 4 and Nitro.
- Evaluation of SSR, prerendering, preview deployments, server routes, email integration, rate limiting, storage, logs, regions, limits, and cost.
- Small representative deployment proving the required Nuxt and contact-endpoint runtime.
- Architecture Decision Record naming the selected platform and rejected alternatives.
- Documented operational and vendor-specific constraints.

## Acceptance criteria

- The decision uses current official provider and Nuxt documentation.
- The representative deployment validates SSR, static assets, one server endpoint, secrets, and logs.
- Pricing assumptions include expected low traffic and a plausible growth case.
- The selected platform supports GitHub preview and production deployments.
- The ADR separates technical requirements from subjective preferences.

