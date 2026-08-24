# BE-03: Implement the Contact Submission Workflow

**Status:** Planned  
**Depends on:** BE-02, DEP-01

## Objective

Implement the complete server-side workflow that validates a lead, delivers it through the selected provider, and returns an accurate result.

## Deliverables

- Nitro API endpoint using the shared lead contract.
- Validation and normalization before workflow execution.
- Transactional email or selected lead-delivery integration.
- Optional lead persistence only if the hosting ADR requires it.
- English/Russian notification context without trusting client-authored templates.
- Idempotency or duplicate-suppression behaviour appropriate to the selected delivery path.

## Acceptance criteria

- The endpoint reports success only after confirmed delivery or accepted durable processing.
- Provider failures map to stable public error codes without leaking credentials or internals.
- Duplicate retries do not create uncontrolled repeated notifications.
- The workflow has focused tests for success, invalid input, provider rejection, and provider timeout.
- Provider-specific mapping stays inside the delivery boundary rather than the public endpoint.

