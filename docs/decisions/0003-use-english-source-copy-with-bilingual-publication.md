# 0003: Use English Source Copy with Complete Bilingual Publication

**Status:** Accepted

**Date:** 2026-08-24

## Context

The primary hiring audience is international, while the website must also serve Russian-speaking visitors. Existing website copy is not available and will be written during the project.

## Decision

- Write new source content in English.
- Have Codex perform the first English review and Alexander perform the final review.
- Create Russian content from the approved meaning rather than literal translation.
- Publish every page, case study, and article only when both language versions are complete.
- Use English canonical routes without a locale prefix and Russian routes under /ru/.
- Design components for Cyrillic and at least 30 percent text expansion.

## Consequences

- Content creation is part of each page and case-study task, not a final translation pass.
- English and Russian route parity is a release requirement.
- The language switcher must preserve the current content equivalent.
- Typography choices require strong Latin and Cyrillic coverage.

## Related documents

- [Content guidelines](../product/content-guidelines.md)
- [Project brief](../product/project-brief.md)
- [DES-05](../../tasks/design/05-define-multilingual-typography-and-content-rules.md)
- [FE-02](../../tasks/frontend/02-implement-i18n-routing-and-translation-contract.md)
- [FE-03](../../tasks/frontend/03-implement-multilingual-content-collections.md)
