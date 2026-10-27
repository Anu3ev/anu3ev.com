# Roadmap

Written 27 October 2026. This folder sets the order of upcoming work. [STATUS.md](STATUS.md) tracks every task, done and planned. Each task keeps its own folder under `docs/tasks/`: a `plan.md` before the work and a `summary.md` after it.

## M5 — Recommendations

Eight colleagues have written recommendations for Alexander on LinkedIn. They are a manager, the CTO and co-founder of inSales, a director of development, a team lead, a design lead, two engineers and an English coach. All eight are public on LinkedIn ("All LinkedIn members") and written in English. The site will show them in three places:

1. **Their own section**, with a list page and one page per recommendation. Each page shows the full text and a link to the original on LinkedIn. Mockups: R1 (list) and R2 (one recommendation).
2. **A teaser on About**, with three opening lines and a "Read all 8 recommendations" link. Mockup: R3.
3. **The case pages they mention.** A quoted sentence sits under the results, with the people who mention the case. Mockup: R4.

A sixth section needs room in the phone menu, which has five equal tabs today. That work is a separate task, and its design is still open.

Mockups: the [design canvas](https://claude.ai/artifact/RmPeTJMZCzdYe4eUu9s6s7) (private to the owner). The owner approved R1–R4 on 27 October 2026.

### Order

| Step | Task | Depends on | Why this order |
| --- | --- | --- | --- |
| 1 | [46 — Recommendation pages](../tasks/46-recommendation-pages/plan.md) | — | The content model and the eight texts come first; every other task reads them. |
| 2 | [47 — Sixth item in the navigation](../tasks/47-navigation-sixth-item/plan.md) | design choice | The section needs a way in from every page before the list is announced. |
| 3 | [48 — Recommendations list](../tasks/48-recommendations-list/plan.md) | 46, 47 | Opens the section: list page, sidebar and phone menu entries. |
| 4 | [49 — Teaser on About](../tasks/49-recommendations-on-about/plan.md) | 46, 48 | The "Read all" link needs the list page. |
| 5 | [50 — Mentions on case pages](../tasks/50-recommendations-on-cases/plan.md) | 46 | Uses the `mentions` field from task 46. It can run in parallel with 49. |

Every merge to `master` deploys, so the work goes live task by task. After task 46 the pages exist but nothing links to them. Task 48 opens the section to visitors and bumps the version to 1.6.0. Tasks 49 and 50 are patch releases.

### Decisions (the owner can override)

- **The text is verbatim and in English on both language versions.** It is never translated or shortened. The Russian pages explain in one line that the original is in English, and the text block carries `lang="en"`. Why: a recommendation is someone else's words. A translation would put words in their mouth.
- **Each page links to its source on LinkedIn.** LinkedIn has no permalink for a single recommendation, so the link opens Alexander's recommendations list. Task 46 checks this again.
- **Initials, not photos.** The recommenders' LinkedIn photos are not copied to the site. Their consent covers the text on LinkedIn, not their faces on another site.
- **No `Review` or `AggregateRating` markup.** Google treats reviews a person publishes about themselves as self-serving and ignores them. The pages use plain `WebPage` data with the author and date, and the Person `@id` links them to Alexander.
- **They go into `llms.txt` and the Markdown copies**, the same way as cases and articles (task [45](../tasks/45-geo/summary.md)).
- **A courtesy heads-up comes first.** Alexander tells the eight people before task 48 goes live. This is an owner action, not a code task.

### Open questions

| Question | Where it is decided | Current proposal |
| --- | --- | --- |
| Phone menu design | 47 | N5: tabs sized to their labels plus a full-height "\| ›" segment. Alternatives are N6 (four fixed tabs plus a Menu panel) and N2 (the earlier peek with an edge fade and a small arrow). |
| Tab label | 47 | Keep "Recommendations" / «Рекомендации» in a tab as wide as the word. If the tabs stay equal width, use «Отзывы» in Russian. No English short word was found that is both short and accurate. |
| Position of the tab | 47 | Fifth, before Contacts. Contacts is also reachable from Home and every case, so it is the safest tab to put past the edge. |
| Names written in Cyrillic | 46 | Show each name as written on LinkedIn (Евгений Лоншаков, Роман Горбачев). Add a Latin spelling on the English pages only if the person uses one. |
| Which three appear on About | 49 | Egor Fedkin (direct manager), Andrey Stikheev (CTO and co-founder) and Dmitry Sadovsky (senior engineer). Controlled by `featured` in the CMS. |
