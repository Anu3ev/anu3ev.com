# BE-02: Define the Lead Submission Contract

**Status:** Planned  
**Depends on:** BE-01

## Objective

Define one typed, localized, and privacy-conscious contract for contact-form submission and server responses.

## Deliverables

- Request schema for name, email, enquiry type, message, locale, consent, and bot-verification token when required.
- Normalized success and error response types.
- Stable error codes for validation, abuse rejection, rate limiting, delivery failure, and temporary unavailability.
- Field limits, normalization rules, and accepted content types.
- Data-retention and logging classification for every request field.

## Acceptance criteria

- The same schema drives server validation and frontend types without duplicating runtime business rules.
- Every non-success outcome has a stable code that can be localized on the client.
- Message contents and personal data are excluded from routine logs and analytics.
- Return values from validation and delivery operations are checked explicitly.
- Invalid requests fail before any external delivery call.

