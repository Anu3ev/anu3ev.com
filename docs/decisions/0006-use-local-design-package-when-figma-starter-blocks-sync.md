# 0006: Use the Local Design Package When Figma Starter Blocks Synchronization

**Status:** Accepted

**Date:** 2026-08-25

## Context

The project design file was created in Alexander's Figma workspace and its primitive and semantic color foundation was started. The connected Starter plan permits only one variable mode per collection, so Light and Dark required separate semantic collections. During the same run, the Figma MCP service reached the Starter tool-call quota before pages, component sets, screen compositions, and prototype links could be created.

Stopping all design work at that external limit would leave the product decisions, responsive behavior, and implementation contract incomplete. Treating the partial Figma file as complete would be misleading.

## Decision

- Complete the design as a versioned local package under `docs/design`.
- Use the semantic token file, design-system specification, responsive HTML/CSS prototype, accessibility audit, and handoff as the authoritative implementation contract until Figma synchronization resumes.
- Keep the Figma file and every created collection. Do not recreate or fork it when the quota resets.
- Record exact Figma IDs, constraints, completed work, and next synchronization steps in `docs/design/figma-state.json`.
- Model Light and Dark as separate one-mode semantic collections only while the Starter restriction remains. Upgrade them to proper modes when the workspace supports it.
- Apply accessibility corrections to the local token source immediately and list any corresponding Figma update as pending.

## Consequences

- The responsive design can be reviewed and implemented without waiting for an account quota.
- Figma is currently a partial mirror, not the complete design source.
- The local prototype is intentionally static and must not be copied wholesale into Nuxt; components, semantics, and tokens are implemented through the documented contracts.
- A later Figma session can resume deterministically without losing or duplicating work.
- Figma-specific acceptance criteria for component instances and clickable prototype links remain pending until the external limit changes.

## Related documents

- [Design package](../design/README.md)
- [Figma state ledger](../design/figma-state.json)
- [Design handoff](../design/handoff.md)
- [DES-03](../../tasks/design/03-create-figma-file-and-lock-library-scope.md)
- [DES-06](../../tasks/design/06-build-core-component-library.md)
- [DES-09](../../tasks/design/09-create-prototype-and-run-accessibility-audit.md)
