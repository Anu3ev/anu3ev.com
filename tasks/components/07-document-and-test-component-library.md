# CMP-07: Document and Test the Component Library

**Status:** Planned  
**Depends on:** CMP-03, CMP-04, CMP-05, CMP-06

## Objective

Make component contracts discoverable and protect them against visual, behavioural, and accessibility regressions.

## Deliverables

- Usage documentation for every production component.
- Variant, state, slot, prop, event, and accessibility documentation.
- Component tests for meaningful behaviour and public contracts.
- Visual regression coverage for both themes and both locales.
- Code Connect mappings between stable Vue components and approved Figma components.

## Acceptance criteria

- Documentation explains when not to use a component as well as when to use it.
- Tests assert observable behaviour rather than Vuetify internals.
- Visual fixtures include long Russian content and missing optional media.
- Code Connect mappings reference real component APIs and compile successfully.
- No exported component exists without a justified production consumer.
