# DEP-04: Configure Domain, DNS, TLS, and Redirects

**Status:** Planned  
**Depends on:** DEP-03, FE-06

## Objective

Connect anu3ev.com to production without losing existing URL value or creating duplicate canonical hosts.

## Deliverables

- DNS records for the selected hosting provider.
- Automatic TLS certificate issuance and renewal.
- One canonical host decision for apex versus `www`.
- HTTPS and canonical-host redirects.
- Redirect map for any discovered legacy URLs.
- Verification of English, Russian, asset, sitemap, robots, and error routes.

## Acceptance criteria

- HTTP and the alternate host redirect to one HTTPS canonical host.
- Redirects preserve the intended path and query only where appropriate.
- Locale routes do not create loops or lose localized slugs.
- Certificates validate for every public host.
- DNS changes and rollback values are recorded before modification.

