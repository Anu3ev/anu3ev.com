# 0004: Create an Original Design Baseline in Alexander's Personal Figma

**Status:** Accepted

**Date:** 2026-08-24

## Context

Alexander does not have reference websites he wants to copy. The site still needs a distinctive, comfortable visual direction and a reusable design system. The connected Figma account belongs to Alexander, but its current integration reports a View seat.

## Decision

- Create the design in Alexander's personal Figma workspace.
- Do not request or exchange an account password.
- Verify edit access immediately before creating the file.
- If the integration cannot write with the current seat, Alexander creates an empty file or grants edit access and provides its link.
- Start from an original baseline derived from product goals and real content.
- Review the baseline critically, then iterate from specific feedback.
- Complete discovery and information architecture before building tokens, components, and screens.
- Use dark default and complete light themes, a muted copper-orange accent, warm neutral surfaces, mobile-first layout, tile-based composition, restrained motion, and WCAG 2.2 AA.

## Consequences

- The absence of visual references does not block design work.
- The first visual direction is a testable proposal, not a final identity.
- The Figma file will contain variables, semantic tokens, reusable components, variants, responsive screens, and documentation rather than disconnected mockups.
- Figma write access is a concrete prerequisite for DES-03, but it does not block DES-01 or DES-02.

## Related documents

- [Project brief](../product/project-brief.md)
- [DES-03](../../tasks/design/03-create-figma-file-and-lock-library-scope.md)
- [DES-04](../../tasks/design/04-define-visual-direction-and-design-tokens.md)
- [DES-06](../../tasks/design/06-build-core-component-library.md)
