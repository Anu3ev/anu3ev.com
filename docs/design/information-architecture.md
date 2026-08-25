# Information Architecture and User Journeys

**Status:** Revised design contract in review

**Updated:** 2026-08-25

## Product priority

The site first helps Alexander secure a strong international frontend role. Project enquiries and technical writing are useful secondary paths, but they do not displace evidence of product engineering depth.

## Sitemap

```text
Home
├── Work
│   └── Case Study
├── Writing
│   └── Article
├── About
├── Contact
├── Privacy
└── 404
```

No separate Services, skill-cloud, search, or filter page is part of the first version. Work and writing can add filters only after the content volume proves a need.

## Production route contract

English is the default locale and has no prefix. Russian uses `/ru`. Public labels are translated; stable Latin route segments avoid encoded Cyrillic URLs. A shared content ID, not the URL, maps localized case studies and articles.

| Template   | English          | Russian             | Primary action           |
| ---------- | ---------------- | ------------------- | ------------------------ |
| Home       | `/`              | `/ru`               | View selected work       |
| Work       | `/work`          | `/ru/work`          | Open a case study        |
| Case Study | `/work/:slug`    | `/ru/work/:slug`    | Discuss related work     |
| Writing    | `/writing`       | `/ru/writing`       | Open an article          |
| Article    | `/writing/:slug` | `/ru/writing/:slug` | View related work        |
| About      | `/about`         | `/ru/about`         | View work or contact     |
| Contact    | `/contact`       | `/ru/contact`       | Send an enquiry          |
| Privacy    | `/privacy`       | `/ru/privacy`       | Return to contact        |
| 404        | fallback         | `/ru/*` fallback    | Return home or view work |

The language switch must resolve the equivalent localized content item. It must never send a visitor to Home merely because they switched language.

## Primary journeys

### Recruiter

Home role and proof summary → selected editor case → experience and ownership evidence → About or Contact. Work must be reachable in one action from the first viewport; Contact in no more than two.

### Engineering or product leader

Home → case-study constraints and decisions → implementation evidence and trade-offs → related case or Contact. The case leads with the problem and Alexander's role, not a tool list.

### Founder or agency

Home → selected work → working-arrangement context → Contact. The form asks only for the minimum information needed to start a useful conversation.

### Article reader

Article → author and evidence context → related work → Contact or another article. The article is useful on its own and is not forced into a job-search pitch.

## Home content order

1. Role, direct positioning, primary case action, portrait, and contact action.
2. Compact verified-facts row.
3. Two featured work directions: Product Image Editor and Abandoned Carts.
4. Experience timeline and colleague recommendation.
5. One complete article preview.
6. Job-focused contact call to action and footer.

The portrait supports trust but does not replace project evidence.

## Public and internal boundary

Only Home, Work, Case Study, Writing, Article, About, Contact, Privacy, and 404 belong to public navigation. `prototype/states.html` is an internal review artifact for tokens, component states, localization stress, and editorial components. It must not be linked from the production header, footer, sitemap, or search index.

The flat prototype uses `ru-*.html` files so every locale pair can be reviewed without a runtime. Production keeps the canonical route contract above and resolves locale equivalents by shared content ID.

## Case-study narrative

Every case follows the same readable sequence:

1. Context: what the product and user were trying to do.
2. Constraints: legacy behavior, browser/runtime limits, unclear requirements, or delivery boundaries.
3. Role: Alexander's verified ownership and collaboration boundary.
4. Decisions: the important alternatives and why a direction was chosen.
5. Implementation: only the mechanisms needed to understand the decision.
6. Outcome: verified scale or observable change, with unsupported metrics omitted.
7. Evidence: screenshots, repository, package, demo, code, or recommendation.
8. Reflection: what remains uncertain or would be improved next.

## Navigation and calls to action

- Desktop navigation: Work, Writing, About, Contact, locale, theme.
- Mobile navigation: the same destinations in one disclosure menu; locale and theme remain explicit text/control choices.
- Primary actions use the copper filled treatment. Secondary actions use a bordered treatment.
- Links say where they lead: `View selected work`, `Read the case study`, and `Contact me`. Generic `Learn more` is avoided.
