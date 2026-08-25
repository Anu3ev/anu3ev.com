# Design Content Deck

**Status:** Complete bilingual revision candidate; Alexander's approval is required before publication

**Updated:** 2026-08-25

## Positioning

**Role:** Product Frontend Engineer

**English headline:** I build browser editors and merchant software with Vue and TypeScript.

**Russian headline:** Создаю браузерные редакторы и продукты для продавцов на Vue и TypeScript.

The copy states the product, work type, and core technology directly. It avoids advertising meta-language, unsupported seniority labels, formal leadership claims, and repeated `X, not Y` constructions.

## Home structure

1. Direct positioning, primary editor-case action, contact action, and square portrait.
2. Four verified facts: inSales product-frontend period, production editor scale, Abandoned Carts scale, and support-to-frontend path.
3. Product Image Editor and Abandoned Carts with different evidence compositions.
4. Experience timeline and one attributed recommendation excerpt.
5. One complete technical article candidate.
6. Job-focused contact call to action.

## Work directions

### Product Image Editor

- Reusable TypeScript and FabricJS core integrated into inSales merchant workflows.
- Canvas and object state, history, crop, layers, rich text, templates, export, AI-assisted image operations, and host-product integration.
- Production use by thousands of inSales clients.
- Public repository, package, demo, and current API are separate evidence from production scale.

### Abandoned Carts

- Analytics, date selection, search, filters, pagination, cart details, communication history, message flows, feature flags, QA handoff, and production verification.
- Used by more than 1,000 clients.
- No revenue, conversion, or recovery metric is claimed.

### Commerce Workflows

- AI-assisted product-description editing inside TinyMCE.
- Cart and checkout options, add-ons, one-click ordering, and multi-warehouse source selection.
- reCAPTCHA v2/v3 and Yandex SmartCaptcha browser flows.
- Monaco-based HTML and Liquid template editing.

### Modernisation and UI Foundations

- Participation in the production migration from Vue 2 to Vue 3.
- `script setup`, Composition API, and composable extraction are tied only to verified work.
- Reusable components and interaction patterns added to an internal Vuetify UI kit.
- The copy does not claim company-wide design-system ownership or tie Pinia to the migration.

## About narrative

The About page follows the verified sequence:

1. Senior Technical Support Engineer at inSales, October 2019 to October 2021.
2. Internal move to Frontend in October 2021.
3. Product frontend work through August 2026.

It explains how storefront debugging and direct merchant work informed product development. It names the cross-functional team boundary and does not imply people management, ownership of the whole frontend organization, or internal working rules copied from project instructions.

## Representative case

**Title:** A reusable image editor for inSales merchant workflows

**Sequence:** context and role → production interface → architecture → real public API → public-demo interaction states → performance problem → test strategy → result and public links.

The only code sample uses public methods from the repository:

```ts
await editor.imageManager.importImage({
  source,
  scale: 'image-contain'
})

await editor.imageManager.exportCanvasAsImageFile({
  fileName: 'edited-image.png',
  contentType: 'image/png'
})
```

## Article candidate

**Content ID:** `image-history-base64-to-blob-urls`

**English:** Moving a browser editor’s image history from base64 to Blob URLs

**Russian:** Как мы перевели history браузерного редактора с base64 на Blob URL

**Status:** `review`

**Calculated reading time:** 5 minutes in both locales.

The article covers the initial base64 model, serialized history, Blob/Object URL ownership, Web Workers, background export, cleanup, browser storage, Safari, testing, and the trade-off introduced by a resource registry. It contains no percentages, throughput values, or memory figures without a source.

Production renders this article only after its content status changes to `published`, both locale documents exist, and Alexander approves the final text.

## Contact contract

**English headline:** Let us start with the reason you are getting in touch.

**Russian headline:** Начнём с причины обращения.

The form contains:

- reason: `job-opportunity`, `project-consulting`, or `other`;
- `job-opportunity` selected first;
- name;
- email without a work-email restriction;
- optional company;
- message;
- consent linked to Privacy.

Email, LinkedIn, and Telegram remain available without the form.

## Recommendation

The design uses short translated or original excerpts from Dima Sadovskiy's received recommendation. Quoted text and attribution remain subject to Alexander's approval. The recommendation Alexander wrote for Dima under `Given` is excluded from evidence about Alexander.

## Editorial approval boundary

- English is the source language.
- Codex has completed the factual and natural-language review represented by this revision.
- Alexander performs the final English review.
- Russian is a full adaptation of the revised English content and receives a final bilingual parity review after English approval.
- Privacy remains provisional until the form processor, retention period, and infrastructure are selected.
- No item is production-public while its content status is `review` or either locale is missing.
