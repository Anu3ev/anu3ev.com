# DEP-07: Run the Production Launch Checklist

**Status:** Planned  
**Depends on:** DEP-04, DEP-05, DEP-06, FE-09, BE-05

## Objective

Launch only after user journeys, localized SEO, delivery, observability, and rollback have been verified against production behaviour.

## Deliverables

- Production smoke test for every public page template in both locales.
- Contact submission test using a controlled production-safe message.
- Canonical, `hreflang`, sitemap, robots, redirect, and structured-data validation.
- Accessibility and performance spot checks on production responses.
- Monitoring and alert verification.
- Recorded launch result, known limitations, and first post-launch review date.

## Acceptance criteria

- All canonical and localized routes return expected status codes and content.
- Contact delivery succeeds and produces the expected operational event.
- No preview host or query alias is indexable as canonical content.
- Production passes required accessibility and performance budgets.
- Rollback remains available and has a named owner.
- Post-launch Search Console, analytics, and error checks are scheduled.
