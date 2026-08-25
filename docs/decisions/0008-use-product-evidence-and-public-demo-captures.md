# 0008: Use Product Evidence and Public Demo Captures

**Status:** Accepted

**Date:** 2026-08-25

## Context

The original prototype repeated one highly compressed image across pages and used it as broad visual proof. It did not make the editor or the wider product work easy to inspect. Product screens must remain authentic, and the public demo must not receive private data during capture.

## Decision

- Use high-resolution source frames from Alexander's Notes for the Product Image Editor, Abandoned Carts, Visual Storefront Editor, and AI Product Content Editor.
- Keep values on product screens unchanged. Do not add fictional metrics or reconstruct missing UI.
- Capture crop, text/layers, and wider integration states from the public image-editor demo using a generated non-personal sample image.
- Keep source, caption, and alt text attached to every public figure.
- Remove the old 47 KB `image-editor.jpg` from the prototype.
- Present evidence through `EvidenceFigure`, `AnnotatedScreenshot`, `CaseDiagram`, and architecture/performance diagrams instead of one repeated card treatment.

## Consequences

- The case study can show product context and real browser behaviour at readable sizes.
- Demo captures prove only the public interaction surface; they do not establish production scale.
- Product screenshots still require Alexander's final publication-safety approval and responsive production exports.

## Related documents

- [Content inventory](../product/content-inventory.md)
- [Design quality audit](../design/design-quality-audit.md)
- [Design system](../design/design-system.md)
- [DES-07](../../tasks/design/07-design-homepage-representative-case.md)
- [DES-08](../../tasks/design/08-design-responsive-page-templates.md)
