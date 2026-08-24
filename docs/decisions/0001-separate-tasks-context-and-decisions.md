# 0001: Separate Tasks, Product Context, and Decisions

**Status:** Accepted

**Date:** 2026-08-24

## Context

The project needs an executable backlog, a durable factual description, and a history of decisions. Keeping all three in task files would duplicate information and make accepted contracts disappear as tasks are completed.

## Decision

- Keep executable work in tasks.
- Keep current product facts, evidence, assets, and content rules in docs/product.
- Keep durable cross-cutting choices in numbered files under docs/decisions.
- Link between these areas instead of copying the same contract into several task files.
- When a decision changes, add a new record that supersedes the old one rather than silently rewriting project history.

## Consequences

- A new contributor can find the current truth without reading the entire backlog.
- Completed tasks can be archived without losing the reasoning behind the result.
- Documentation requires deliberate updates when new evidence or decisions appear.
- Small local implementation choices do not need a decision record unless they affect a shared contract.

## Related documents

- [Documentation index](../README.md)
- [Task index](../../tasks/README.md)
