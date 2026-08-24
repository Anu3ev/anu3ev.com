# BE-05: Add Lead Observability and Privacy Controls

**Status:** Planned  
**Depends on:** BE-03, DEP-01

## Objective

Make lead delivery diagnosable while minimizing personal-data collection, storage, and exposure.

## Deliverables

- Structured operational events for accepted, rejected, delivered, failed, and rate-limited submissions.
- Correlation identifiers that do not encode personal data.
- Redaction rules for logs, traces, and error reports.
- Retention and deletion policy for any persisted lead data.
- Alert conditions for sustained delivery failures or abuse spikes.
- Privacy-page inputs describing collected data and purpose.

## Acceptance criteria

- Operators can distinguish validation, abuse, provider, and infrastructure failures.
- Logs never contain message bodies, verification tokens, or full personal records.
- Retention duration and deletion responsibility are explicit.
- Monitoring failure does not prevent submission processing.
- Privacy documentation matches actual runtime behaviour.
