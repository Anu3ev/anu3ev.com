# BE-01: Define the TypeScript Server Runtime

**Status:** Planned  
**Depends on:** FE-01

## Objective

Define the server responsibilities and runtime constraints that the hosting decision and backend implementation must satisfy.

## Deliverables

- Nitro server boundary and directory conventions.
- TypeScript rules shared with browser code only where contracts are genuinely common.
- Runtime requirements for request handling, email delivery, storage, rate limiting, secrets, and observability.
- Environment configuration contract with fail-fast validation.
- Decision on what data is transient, persisted, or derived.
- Hosting requirements supplied to DEP-01.

## Acceptance criteria

- Server code does not import browser-only modules or state.
- Public request contracts are separated from provider-specific payloads.
- Required environment values fail clearly during startup or build.
- The runtime requirements are concrete enough to compare hosting providers.
- No provider abstraction is created before more than one implementation is justified.

