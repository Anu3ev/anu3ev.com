# 46 — Recommendation pages

All eight LinkedIn recommendations now have their own page at `/recommendations/<slug>/` and `/ru/recommendations/<slug>/`. Nothing links to them yet: task 48 adds the list and the menu item. Plan: [plan.md](plan.md).

## Source

The texts were copied from LinkedIn → Recommendations → Received on 27 October 2026. All eight are public ("All LinkedIn members") and complete; expanding "… more" changed nothing. Egor Fedkin typed `**…**` around two project names. LinkedIn shows the asterisks literally; the site renders them as the bold he meant, and the build check ignores them.

LinkedIn has no public link to a single recommendation. The only per-recommendation links on the page are owner-only actions. Every page therefore links to the owner's recommendations list, `…/details/recommendations/`, which LinkedIn shows to signed-in members.

## Content model (differences from the plan)

One Markdown file per person in `content/recommendations/`, shared by both languages. The schema is `recommendationSchema` in `shared/content-schema.ts`. The Nuxt Content collection is `recommendations`.

- **`highlight` is a chosen sentence, not the opening line.** Most texts open with "I worked with Alexander at inSales…", which says nothing on a card. The rule that matters stayed: the sentence is copied from the text without changes.
- **`headline_en` and `headline_ru`** replace one `headline`. A Russian page showing "Team Lead at InSales" while the rest of the page is Russian read as a translation slip. The headline is the site's description of the person, not their words, so translating it is fine.
- **No `source` field.** It would be the same URL in every file, so the page builds it from `profile.linkedin`.
- **No `relationship_note`.** The one candidate, "for more than five years", is already in Egor's text.
- **Names are as written on LinkedIn**, including Евгений Лоншаков, Роман Горбачев and "Bedarev Vladimir" in his own order.
- **`mentions`:**
  - Egor: product-image-editor and abandoned-carts.
  - Andrey: the same two.
  - Dmitry: visual-storefront, product-image-editor, image-editor (the editor core he names) and abandoned-carts.
  - The other five name no case that has a page. Vladimir writes about templates and performance, but in general terms. The Vue 3 migration that three people mention has no case page.
- **`featured`:** 1 Egor, 2 Andrey, 3 Dmitry, for task 49.

**Build checks** in `readRecommendations` (`scripts/lib/content.ts`):
- the filename is a valid slug;
- the highlight and every quote occur in the text, ignoring `**` and line wrapping;
- every mentioned case is published;
- no About position is used twice.

A paraphrase fails the build.

## The page

- A back link to About. It switches to the list in task 48.
- The Recommendations eyebrow, round initials (not a photo), the name as the H1 and the headline.
- Two facts: How we worked (first person: "Managed me directly", "Senior colleague, not my manager", "Worked on the same team", "My teacher") and Written (a localized date).
- The full text in the main text colour. `.prose p` is muted and comes later in the file, so the page uses `.prose.recommendation-text` to win on specificity, not order.
- **On Russian pages:** «Рекомендация написана на английском, текст приведён без перевода.», and the text block has `lang="en"`.
- "Read the original on LinkedIn ↗" opens in a new tab with `noopener noreferrer`.
- **Work mentioned:** the case titles in the page's language, in the order the recommender wrote about them.
- The top bar shows "What colleagues say" / «Что говорят коллеги».

**SEO and GEO:**
- A `WebPage` with `about` set to the owner's Person `@id` and `author` set to the recommender (job title and LinkedIn profile). `inLanguage: en` and `isBasedOn` point to the LinkedIn list. No `Review` markup.
- Both languages are in the sitemap.
- Each page has a Markdown copy at `…/index.md`, announced in the head. Its facts are written in the third person ("managed Alexander directly"), because those files describe the owner rather than speak for him.
- `llms.txt` and `llms-full.txt` gain a Recommendations section in both languages.

**CMS.** A Recommendations collection in Sveltia:
- the case field is a relation to Projects;
- the hints repeat the rules: verbatim text, a copied highlight and quotes, positions 1–3.

## Tests

- **Unit:**
  - the inventory accepts a copied highlight through emphasis, and rejects a reworded one, an unpublished case, a bad filename and a duplicate About position;
  - routes include both languages and skip drafts;
  - `llms.txt` lists every recommendation;
  - the Markdown copy has its facts and the original text;
  - the CMS edits every schema field.
- **E2e** (`recommendations.spec.ts`):
  - every page in both languages: name, text and top bar; on Russian, the note and `lang="en"`;
  - the LinkedIn link's `href`, `target` and `rel`, and the Markdown alternate;
  - case links in Russian, and no list when there are no mentions;
  - 404 for an unknown slug.
- A recommendation page is in the accessibility suite: axe in both themes and languages, `title` on every control, reflow at 320 px.
- **An existing test caught a real bug:** in a YAML `{ … }` line a comma splits the value, so the CMS read "Senior colleague, not my manager" as two options. The values are now quoted.
- **Run locally with Node 24.15.0:**
  - `pnpm check` (68 unit tests) and `pnpm build` (60 sitemap pages, 125 prerendered routes);
  - the full e2e suite: 120 passed and 1 failed on the first run (the CMS config test above);
  - after the fixes, all 121 passed.
- Phone and desktop screenshots in both languages were checked by eye. The first look found a muted text colour and the Home title in the top bar; both are fixed.

**Limits.**
- GitHub Actions still can't start jobs because of the account's billing status.
- The pages are live but unlinked until task 48.
- Tell the eight people before task 48 announces the section.

## Correction after release

Nuxt Content fills its own `excerpt` field from the Markdown body and overwrites a frontmatter field with that name. The field shipped as `excerpt`, so on production every page's meta description fell back to "Recommendations". The page text was not affected. Task 48 renamed the field to `highlight` and added an e2e check on the meta description.

