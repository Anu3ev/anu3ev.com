# 22 — Home positioning

The home page now presents Alexander the way his job-search plan targets him. The sources were the "Who I Am as a Professional" sheet (B5–B39) and the "ABCD Plan" sheet of *My table English.xlsx*, the `tailor-alexander-resume` skill's verified profile and metrics, and his notes on strengths and skills.

**Who it is written for.** Plan B, the current search with an offer by 31.01.2027, is a Senior/Middle Frontend role using Vue, TypeScript and complex UI. Plan A, the long term, is complex product UI: editors, no-code builders, e-commerce SaaS. The page is written for Plan B readers, using the title they search for, and shows Plan A depth through the proof points. Plan C (freelance or support) and Plan D (iGaming, cheap outsourcing, Russia) are not signalled anywhere.

**Decisions**

- **Headline:** "Senior Frontend Engineer" / «Senior frontend-разработчик», as on the CV and LinkedIn. It also answers the open question in B39 (8.2) about why he calls himself Senior: the bio and proof points show scope (shared systems, products owned end to end, code every storefront runs on), not years. «Продуктовый frontend-разработчик» read as a calque in a headline.
- **Bio:** what he builds (complex browser tools: editors, merchant workflows, shared libraries), then 5 years at inSales (60,000+ merchants) taking unclear features to production and maintaining them. "5 years" follows the skill's wording rule.
- **Proof points:** a new CMS-editable `home.highlights` list. Each item comes from the CV with its attribution limits:
  - 3,000+ active clients for the *product* image editor, not the library or npm package
  - ~70% fewer storefront product requests
  - 90%+ of stores on the site editor redesign he *implemented*, not designed
- **Tags:** "Vue & TypeScript" becomes one tag, which frees a slot for "Complex product UI", his own differentiator phrase.
- **Profile focus card and pinned note:** they now carry the positioning: complex UI owned end to end; editors, storefront performance, API contracts with backend.
- **Consistency fixes:** the About experience role now reads "Senior Frontend Engineer", the same title as the CV. A new `location_ru` field, so the Russian page no longer shows "Batumi, Georgia". The default Open Graph card uses the new headline and topics.
- **Kept on purpose:** English lines the owner approved (sidebar bio, footer tagline, "Built with care", "Personal space").
- **Claims avoided** (per the skill's truth gate): fullstack, lead or manager; React or Node; "currently at inSales"; 60,000 for any single feature; withdrawn editor and captcha metrics.

**Checks.** The CMS settings unit test now covers the home fields and the highlight item fields. The settings e2e test asserts the proof points and the localized location in both languages. `pnpm check` (51 unit tests), `pnpm build` and **69 browser/axe checks** pass. Screenshots: [EN desktop](screenshots/hero-en-1440.png), [RU mobile](screenshots/hero-ru-402.png).
