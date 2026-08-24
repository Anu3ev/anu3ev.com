# CMP-06: Implement the Contact Form UI

**Status:** Planned  
**Depends on:** DES-08, CMP-02, BE-02

## Objective

Implement the complete bilingual contact-form experience against the agreed server contract.

## Deliverables

- Typed form fields for contact details, enquiry type, and message.
- Visible labels, help text, validation messages, and privacy notice.
- Idle, submitting, success, validation-error, delivery-error, rate-limited, and offline states.
- Keyboard-safe submission and focus movement after errors or success.
- English and Russian messages for every state.

## Acceptance criteria

- Client validation matches the server contract without replacing server validation.
- Failed delivery never appears as a successful submission.
- Error summaries and individual fields expose useful accessible descriptions.
- Repeated submission is prevented while a request is in progress.
- The form remains usable without animation and from a 320 px viewport.

