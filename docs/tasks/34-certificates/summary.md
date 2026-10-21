# 34 — Certificates

The owner asked for a Certificates section with every certificate worth showing, from LinkedIn and his files, built on portfolio best practices and then reviewed and tested by hand.

## Sources and selection

Read on 2026-10-22: the LinkedIn "Licenses & certifications" list with each entry's skills, `~/Documents/Sertificates`, and the `Поиск работы/Certificates` folder in the Obsidian notes. The note «Курсы с сертификатами» is a plan of future courses, so it was not used as a source.

| Certificate | Shown as | Why |
|---|---|---|
| The Vue.js Master Class 2024 Edition — Vue School, 10.2026 | Card | Core stack; course project on Vue 3, Pinia, Router, TypeScript and Supabase |
| EF SET English Certificate — 60/100, B2, 10.2026 | Card | Verifiable; matters for remote international roles |
| 200 hours of English lessons — Preply, 09.2026 | List | On LinkedIn, but there is no public link (only a private dashboard) |
| 4 TypeScript courses — LinkedIn Learning, 04–05.2025 | List | Verifiable, but 1–2 hours each, so not cards |
| 31 hours of English — Preply, 05.2025 | Not shown | Superseded by the 200-hour certificate |
| «Введение в ИИ-агенты» — Sber University, 05.2026 | Not shown | A 3-day participation certificate, not on LinkedIn |

**Vue date.** The Vue certificate prints "December 2024", the course edition's date. The owner bought the course in 2025 and posted on finishing it in October 2026, so the site uses LinkedIn's 10.2026. The preview still shows the printed date; the name "2024 Edition" explains it.

**Vue link.** LinkedIn links to a signed Vue School download that returns 403 without its signature, and Vue School has no public certificate page (`/certificates/<id>` redirects home). The card therefore opens a full-size copy hosted on the site. Because it is internal, it opens in the same tab, following the site rule that only external links open new tabs.

## Practices applied

The research found little specific guidance, and most sources were opinion pieces. These points were applied:
- **Curate, don't list everything.** Weak or superseded items are left out.
- **Certificates support experience.** For a senior engineer, shipped work weighs more, so the section sits on About after Experience. It is not a navigation item.
- **Make it verifiable.** Each item links to the issuer's page where one exists.
- **Show the real document.** The previews are the actual certificates. EF SET's portrait A4 is cropped to its top (name, score, skills, date) to match the 4:3 frame.
- **Mobile first.** Cards stack on phones, and list rows stay one tap target each.

## Implementation

- **Content.** `content/settings/certificates.json` is language-neutral; certificate names stay in the issuer's wording.
  - Summaries and image alt text are per language.
  - `certificatesSchema` requires a featured certificate to have an image, alt text and both summaries.
  - The build checks that every preview and self-hosted copy exists.
  - It is editable in the CMS (Settings → Certificates).
- **UI.** `CertificatesSection` shows cards (preview, type · date, name, issuer, summary, three skills + "N more", link) and a compact list of whole-row links.
  - The portfolio card's skill list became the shared `SkillTags` component.
  - Dates use the site's `MM.YYYY` style through the new shared `formatMonth`, which the career timeline now uses too.
- **Accessibility.** Link names start with their visible text (WCAG 2.5.3). The "opens in a new tab" note is spoken only for external links. Hover and focus states use the existing patterns.
- **Structured data.** About publishes a Person with `hasCredential` (`EducationalOccupationalCredential`, `recognizedBy`, `dateCreated`, `url`, `identifier`). Home's Person now carries the same `@id`.

## Review and manual testing

Defects found and fixed during review:
1. The verify link's hidden text was read as "View credential : …". Link names were reworked.
2. In the compact list, "View credential" repeated on every row, and on phones it took its own line under each item. Rows became single links with an arrow.
3. "(61–62)" and "— 56" broke across lines in both languages. Word joiners and non-breaking spaces fixed it.
4. The Vue School link from LinkedIn was broken (403). It was replaced with the self-hosted copy.
5. axe `label-content-name-mismatch` on the row links. The visible text is now the start of the name.
6. The self-hosted link opened a new tab, against the site's external-link rule. It now opens in the same tab.

Manual checks:
- Screenshots: desktop dark and light (1440), tablet in Russian (1133), phone in dark Russian and light English (402).
- In real Chrome: hover and keyboard focus on a list row; the Vue certificate opens in the same tab and Back returns to About; all issuer links respond (EF SET and the four LinkedIn Learning pages answer 200).

**Tests.**
- Unit: schema and build validation (missing preview, missing self-hosted copy, a card without a summary), `formatMonth`, credential JSON-LD.
- E2e `certificates.spec.ts`: cards with loaded images, link targets and names, the list including a certificate without a link, self-hosted copies return images, `hasCredential` linked to Home's Person, Russian layout on a phone.
- The existing axe, external-link and spacing suites cover the new section.
