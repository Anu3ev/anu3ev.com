# Design Handoff

**Status:** Validated local candidate; Alexander approval and Figma sync are pending

**Updated:** 2026-08-25

## Source hierarchy

1. [tokens.json](tokens.json) defines visual values and semantic aliases.
2. [design-system.md](design-system.md) defines component and typography behavior.
3. [prototype](prototype/) defines responsive composition and content hierarchy.
4. [information-architecture.md](information-architecture.md) defines routes and journeys.
5. [content-deck.md](content-deck.md) defines the verified design copy and approval boundaries.
6. Figma mirrors these sources when its account limits permit; it is not allowed to silently diverge.

## Prototype pages

| Template     | File                                         | Important states                                |
| ------------ | -------------------------------------------- | ----------------------------------------------- |
| Home EN      | [index.html](prototype/index.html)           | Dark/light, desktop/mobile                      |
| Home RU      | [ru.html](prototype/ru.html)                 | Long Cyrillic copy, dark/light                  |
| Work EN/RU   | [work.html](prototype/work.html), [ru-work.html](prototype/ru-work.html) | Four verified work directions |
| Case EN/RU   | [case-study.html](prototype/case-study.html), [ru-case-study.html](prototype/ru-case-study.html) | Product story, real API, demo evidence |
| Writing EN/RU | [writing.html](prototype/writing.html), [ru-writing.html](prototype/ru-writing.html) | One complete article candidate |
| Article EN/RU | [article.html](prototype/article.html), [ru-article.html](prototype/ru-article.html) | Calculated reading time and related work |
| About EN/RU  | [about.html](prototype/about.html), [ru-about.html](prototype/ru-about.html) | Portrait, career, contribution boundary |
| Contact EN/RU | [contact.html](prototype/contact.html), [ru-contact.html](prototype/ru-contact.html) | Job-first intent and short form |
| Privacy EN/RU | [privacy.html](prototype/privacy.html), [ru-privacy.html](prototype/ru-privacy.html) | Pre-launch data contract |
| 404 EN/RU    | [404.html](prototype/404.html), [ru-404.html](prototype/ru-404.html) | Equivalent recovery actions |
| System board | [states.html](prototype/states.html)         | Tokens, components, themes, localization stress |

Append `#theme-toggle` to any prototype URL to open the light theme directly. The visible control also toggles the current page without JavaScript.

## Responsive contract

- Start at 320 px with a 16 px outer gutter and one readable column.
- At 720 px, increase the gutter to 32 px and introduce multi-column grids only for independent tiles, facts, and contact regions.
- At 960 px, replace the disclosure navigation with the desktop navigation and enable the editorial split/featured-work compositions.
- Stop content growth at 1200 px. Keep article and case prose at 720 px.
- Preserve DOM reading order when columns collapse. Do not use CSS ordering to make desktop composition contradict keyboard order.
- Use 16:9 for product evidence. Keep the portrait square and preserve the full natural frame with `object-fit: contain`. Omit optional public media when no valid source exists.
- No text container has a fixed height. Project and article cards may grow independently.

## Component implementation contract

- Build product components around behavior and semantics, even when their internal control is Vuetify.
- Use CSS custom properties as the theme runtime source. Configure Tailwind and Vuetify from the same generated semantic object.
- Tailwind owns layout and small, stable presentation utilities. Vuetify owns the behavior of chosen complex controls. Product wrappers own public props, states, accessibility, and design-system naming.
- Do not style private Vuetify internals with broad deep selectors. If a required visual cannot be reached through props, slots, exposed classes, or theme roles, document the exception in the component.
- Import only used Vuetify components/directives. Tailwind production scanning must include Vue, TypeScript, content, and locale files so unused utilities are not emitted.
- Keep semantic component states explicit: `loading`, `disabled`, `invalid`, `success`, and `current` are not inferred from color classes.
- Use native elements whenever they already provide the required behavior: links for navigation, buttons for actions, labels for fields, and disclosure semantics for a simple menu.

## Localization contract

- Nuxt i18n uses English as the unprefixed default and Russian under `/ru`.
- Locale switching resolves an equivalent route and content ID.
- Every page declares its locale; foreign technical fragments use `lang` only when pronunciation benefits.
- UI labels live in locale messages. Case studies and articles live as complete localized content documents, not one document full of conditional strings.
- Dates, counts, and reading time use `Intl` through the locale layer.
- Publish only when both language versions are complete. Missing translation is an editorial state, not permission to redirect to Home.

## Asset inventory

- `prototype/assets/alexander-anufriev.png`: selected real portrait source. Production must generate responsive AVIF/WebP variants, keep the natural square frame, and retain the original outside the public output.
- `prototype/assets/product-image-editor-production.png`: primary production-editor evidence.
- `prototype/assets/abandoned-carts-production.png`: original empty-data product screen; values must remain unmodified.
- `prototype/assets/visual-storefront-editor.png` and `prototype/assets/ai-product-content-editor.png`: secondary product evidence.
- `prototype/assets/demo-crop.png`, `demo-text.png`, and `demo-layers-history.png`: public-demo captures made with a generated sample image and no private data.
- Product screenshots should remain readable at their displayed size. If a screenshot needs explanation, pair it with a caption rather than decorative cropping.
- Icons should come from one tree-shaken SVG set and use current color. Do not export icon text or raster icons from Figma.

## SEO-visible design requirements

- One descriptive H1 per page and a logical heading hierarchy.
- Real text for role, projects, and actions; do not bake copy into images.
- Breadcrumbs on case studies, articles, contact, privacy, and recovery pages where they improve orientation.
- Space for title, publication/update date, author, reading time, and related content on articles.
- Project evidence links must have descriptive anchor text.
- Locale switch, canonical, and hreflang behavior is implemented in Nuxt rather than inferred from visual state.

## Figma continuation

File: [anu3ev.com - Website & Design System](https://www.figma.com/design/ZVGtT8KoFQL1ixcZqhzGIm)

File key: `ZVGtT8KoFQL1ixcZqhzGIm`

Created collections and IDs are recorded in [figma-state.json](figma-state.json). After the quota resets or the seat is upgraded:

1. Change Dark `border/strong` to primitive `warm/500` to match the accessibility correction.
2. Create or upgrade to true Light/Dark variable modes if the plan supports more than one mode.
3. Add Cover, Getting Started, Foundations, Components, Patterns, Screens, Utilities, and Archive pages.
4. Build the documented components, including EvidenceFigure, AnnotatedScreenshot, ProofRow, CaseDiagram, ExperienceTimeline, and ArticleCard, with Auto Layout, token binding, properties, states, and EN/RU validation examples.
5. Recreate the equivalent EN/RU prototype screens at 390 and 1440 px, plus 768 px only where flow materially changes.
6. Link Home → Case Study → Contact and Article → Related Work.
7. Run structural and visual validation after each phase and update the state ledger.

Code Connect remains deferred until real Vue component files exist. Creating mappings to invented paths would make the handoff less reliable.
