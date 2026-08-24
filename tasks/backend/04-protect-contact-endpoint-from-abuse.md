# BE-04: Protect the Contact Endpoint from Abuse

**Status:** Planned  
**Depends on:** BE-03, DEP-01

## Objective

Protect lead submission from automated abuse without making the form unnecessarily difficult for legitimate users.

## Deliverables

- Server-enforced request-size and content limits.
- Rate limiting appropriate to the selected hosting platform.
- Bot-verification integration when justified by the threat model.
- Honeypot or timing signal only if it adds measurable value.
- Safe handling of client IP or platform request identifiers.
- Abuse rejection and rate-limit responses matching BE-02.

## Acceptance criteria

- Bot verification is always checked server-side.
- Client-side validation cannot bypass rate limiting or abuse controls.
- Failure modes remain accessible and localized in the frontend.
- Secrets and verification responses are never exposed to the browser or logs.
- Tests cover missing, invalid, expired, and replayed verification data where applicable.

