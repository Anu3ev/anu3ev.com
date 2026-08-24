# DEP-06: Set Up Analytics, Monitoring, and Search Tools

**Status:** Planned  
**Depends on:** DEP-03, BE-05, FE-06

## Objective

Measure discovery, page quality, contact conversion, and runtime health without collecting unnecessary personal data.

## Deliverables

- Privacy-conscious analytics with documented events and retention.
- Error and server-delivery monitoring.
- Availability monitoring for representative public routes and the contact workflow.
- Google Search Console property and sitemap submission.
- Dashboard or runbook for traffic, Core Web Vitals, indexing, lead outcomes, and delivery failures.

## Acceptance criteria

- Analytics never captures contact message bodies or sensitive form values.
- English and Russian traffic can be distinguished by canonical route.
- Alerts identify sustained outages and lead-delivery failures.
- Search Console recognizes sitemap, canonical, and `hreflang` relationships.
- Consent requirements match the actual analytics configuration and privacy page.

