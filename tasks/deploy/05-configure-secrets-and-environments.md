# DEP-05: Configure Secrets and Environment Boundaries

**Status:** Planned  
**Depends on:** DEP-01, DEP-03, BE-03, BE-04

## Objective

Provide required runtime configuration without committing secrets or allowing preview environments to affect production services.

## Deliverables

- Inventory of public configuration and server-only secrets.
- Separate local, preview, and production values.
- Provider-managed secret configuration.
- Rotation procedure for email, bot-verification, analytics, and monitoring credentials.
- Safe local-development examples containing no real credentials.

## Acceptance criteria

- Server-only values are absent from client bundles and generated public assets.
- Application startup fails clearly when a required secret is missing.
- Preview credentials cannot send production notifications or write production data.
- Secret values never appear in repository history, build logs, or test snapshots.
- Rotation can be completed without changing source code.

