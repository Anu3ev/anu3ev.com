# 0007: Launch Writing with One Verified Bilingual Article

**Status:** Accepted

**Date:** 2026-08-25

## Context

The first design baseline showed six article cards although the articles did not exist. Their titles and reading times made the Writing section look populated but could not be verified. The project requires complete English and Russian publication and an authored voice grounded in Alexander's real work.

## Decision

- Start with one article about moving the browser editor's image history from base64 to Blob URLs.
- Build the article from an evidence map covering serialized history, Blob/Object URL lifecycle, Web Workers, cleanup, browser storage, Safari, and tests.
- Keep performance results qualitative unless a reliable measurement source is available.
- Calculate reading time from the final body instead of entering it manually.
- Store one shared content ID for the English and Russian documents.
- Render the article in production only when its status is `published`, both locales exist, and Alexander has approved the text.

## Consequences

- Writing launches with less apparent volume and stronger factual integrity.
- The current static prototype can review both complete versions, but the content status remains `review` until approval.
- Future article cards are created only after a real draft and evidence map exist.

## Related documents

- [Content deck](../design/content-deck.md)
- [Information architecture](../design/information-architecture.md)
- [English article prototype](../design/prototype/article.html)
- [Russian article prototype](../design/prototype/ru-article.html)
- [DES-08](../../tasks/design/08-design-responsive-page-templates.md)
