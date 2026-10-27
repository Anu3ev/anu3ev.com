# 46 — Recommendation pages

Status: done ([summary](summary.md)) · Size: M · Milestone: [M5 — Recommendations](../../roadmap/README.md#m5--recommendations) · Mockup: R2 on the [design canvas](https://claude.ai/artifact/RmPeTJMZCzdYe4eUu9s6s7)

## Goal

One page per LinkedIn recommendation at `/recommendations/<slug>` and `/ru/recommendations/<slug>`. It shows the full text exactly as written and links to the original on LinkedIn. This task also adds the content model that tasks 48–50 read.

## The page (R2)

- A "← All recommendations" back link. Until task 48 ships, it points to About.
- Round initials (not a photo), the name as an H1, and the person's title and company at the time of writing.
- A two-column `dl` with Relationship (LinkedIn's wording, e.g. "Managed Alexander directly") and Written (date).
- The full text in its original paragraphs. On the Russian page the block has `lang="en"`, and a one-line note above it says the original is in English.
- A full-width "Read the original on LinkedIn ↗" row. It is an external link, so it opens in a new tab with `rel="noopener noreferrer"`.
- "Mentioned work": links to every case listed in `mentions`. The block is hidden when there are none.

## Content model

One Markdown file per person in `content/recommendations/<slug>.md`, shared by both languages. The body is the verbatim text. Frontmatter is checked by a zod schema in `shared/content-schema.ts`:

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | As written on LinkedIn |
| `headline` | string | Their title and company when they wrote it |
| `relationship` | enum | `managed-directly`, `senior`, `same-team`, `teacher`; the EN/RU wording lives in `messages.ts` |
| `relationship_note` | string, optional | e.g. "for 5+ years", when LinkedIn gives one |
| `date` | date | LinkedIn's date |
| `profile` | url | Their LinkedIn profile |
| `source` | url | Where the recommendation can be read on LinkedIn |
| `excerpt` | string | The opening line, taken from the text without changes; used by 48 and 49 |
| `mentions` | `{ project, quote }[]` | `project` is a case slug; `quote` is one sentence from the text, verbatim. Used here and by 50 |
| `featured` | number, optional | Position in the About teaser (task 49) |
| `published` | boolean | Same draft rule as cases and articles |

A unit test checks that every `excerpt` and `quote` occurs in the body, and that every `project` is an existing case slug. That makes a paraphrase or a broken link fail the build.

Sveltia CMS gets a "Recommendations" collection with the same fields (`public/admin/config.yml`).

## Data to collect

The eight texts come from LinkedIn → Recommendations → Received. Copy them exactly, including paragraph breaks. The `mentions` mapping comes from reading each text. Known so far, to be confirmed against the text:

| Person | Likely cases |
| --- | --- |
| Egor Fedkin | product-image-editor, abandoned-carts |
| Andrey Stikheev | product-image-editor, abandoned-carts |
| Dmitry Sadovsky | visual-storefront, product-image-editor, abandoned-carts |
| Евгений Лоншаков, Роман Горбачев, Bedarev Vladimir, Daniil Churakov, Emmanuel Stephen | to be read |

The Vue 3 migration that several people mention has no case page. Those sentences stay in the full text but get no link.

Check again whether LinkedIn offers a permalink for a single recommendation. If it doesn't, `source` is Alexander's recommendations list.

## SEO and GEO

- `usePageSeo` with a title like "Egor Fedkin on working with Alexander Anufriev" and the excerpt as the description.
- JSON-LD `WebPage` with `about` → the Person `@id` and `author` → a Person with the recommender's name and `sameAs` → their profile. No `Review` markup (see the roadmap decisions).
- A Markdown copy beside each page and a "Recommendations" section in `llms.txt` and `llms-full.txt`, in `scripts/lib/llms.ts`.
- The pages go into the sitemap.

## Tests

- Unit: the schema, the excerpt and quote checks, the Markdown copy and the `llms.txt` section.
- E2e: each published page renders in EN and RU, the text block has `lang="en"` on RU, the LinkedIn link has the right `target` and `rel`, Mentioned work links resolve, there's no horizontal scroll at 360 px, and axe passes.

## Done when

All eight pages are live in both languages with verbatim text and a working LinkedIn link, the CMS can edit them, and the checks pass.
