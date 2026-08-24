# FE-08: Integrate the Contact Form with the Server API

**Status:** Planned  
**Depends on:** FE-04, CMP-06, BE-03

## Objective

Connect the contact experience to the server workflow while preserving accurate user feedback for every response state.

## Deliverables

- Typed request and response integration using the shared lead contract.
- Server validation error mapping to localized form fields.
- Submitting, success, delivery failure, abuse rejection, rate limit, and offline handling.
- Retry behaviour that does not duplicate successful submissions.
- Analytics events that contain no message body or sensitive personal data.

## Acceptance criteria

- Every server outcome produces the matching observable UI state.
- The form never reports success before server confirmation.
- Network retries are bounded and do not create duplicate leads.
- Focus moves to a useful error summary or success confirmation.
- English and Russian messages cover every defined response code.

