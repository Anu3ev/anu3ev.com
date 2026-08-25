# DES-05: Define Multilingual Typography and Content Rules

**Status:** In review
**Depends on:** DES-04

**Revision result:** Typography and localization rules are defined in the [design system](../../docs/design/design-system.md). Every public template now has an EN/RU pair and an equivalent locale link. Final browser expansion validation and Alexander's bilingual copy approval remain.

## Objective

Ensure that English and Russian content share one coherent typographic system and remain readable without locale-specific layout patches.

## Deliverables

- One or two licensed web-font families with strong Latin and Cyrillic coverage.
- Type styles for Display, H1–H4, Body Large, Body, Body Small, Label, and Code.
- Documented line length, line height, wrapping, truncation, and uppercase rules.
- Examples for English and Russian headings, body copy, dates, numbers, reading time, and technical text.
- Text-expansion fixtures with at least 30% longer labels and headings.
- Rules for localized slugs and language-switch labels.

## Acceptance criteria

- Russian content does not require a smaller font size than equivalent English content.
- Font metrics do not materially change layout between scripts.
- Controls remain usable with 30% text expansion.
- Fixed-height text containers are absent unless the content contract proves them safe.
- Languages are labelled with text and never represented only by flags.
