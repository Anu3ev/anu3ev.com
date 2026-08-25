# anu3ev.com Design System

**Version:** 1.0

**Status:** Revised local design candidate; final review and Figma sync pending

**Default theme:** Dark

## Visual direction

The system combines warm graphite surfaces, restrained copper actions, editorial typography, thin structural rules, and evidence-led compositions. Screenshots, facts, flows, timelines, diagrams, and articles use distinct patterns so the site does not become a wall of interchangeable dark tiles.

Use:

- asymmetrical editorial layouts with a dependable content grid;
- project screenshots and a restrained portrait as evidence;
- mono labels for metadata, states, and technical context;
- square or very lightly rounded controls;
- copper for actions, focus, active state, and small evidence markers;
- motion only when it explains state change.

Avoid:

- pure black, neon red/orange, large gradient washes, and glow effects;
- glass cards, floating blobs, oversized pill collections, and fake terminal decoration;
- a generic hero followed by a technology logo cloud;
- animation that delays reading or hides evidence;
- decorative tiles with no information hierarchy.

## Token source

[tokens.json](tokens.json) is the complete machine-readable source. Components consume semantic roles such as `text.primary` and `action.brand`; primitive names such as `warm.950` must stay inside the theme definition.

### Core theme roles

| Role             | Dark      | Light     | Use                           |
| ---------------- | --------- | --------- | ----------------------------- |
| Canvas           | `#110E0C` | `#F7F3EE` | Page background               |
| Surface/default  | `#191512` | `#FCFAF7` | Tiles and grouped content     |
| Surface/subtle   | `#211C19` | `#EEE7DF` | Quiet state and nested region |
| Surface/elevated | `#29231F` | `#FFFFFF` | Menu and raised feedback      |
| Text/primary     | `#F7F3EE` | `#191512` | Headings and main copy        |
| Text/secondary   | `#BDAFA2` | `#574A41` | Supporting copy               |
| Text/tertiary    | `#948477` | `#75665B` | Metadata only                 |
| Text/brand       | `#E39672` | `#78391F` | Eyebrows and selected state   |
| Border/default   | `#3D342E` | `#D9CEC3` | Structural dividers           |
| Border/strong    | `#75665B` | `#948477` | Input and control boundary    |
| Action/brand     | `#D37A52` | `#78391F` | Primary action                |
| Focus/ring       | `#E39672` | `#BF623C` | 3 px keyboard focus           |

Dark and light themes are independently tuned. Light is not an inversion: action copper becomes darker, surfaces gain smaller luminance steps, and text hierarchy is recalibrated.

### Spacing and layout

- Base unit: 4 px.
- Spacing scale: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, and 160 px.
- Minimum control target: 44 × 44 px; large control: 52 px.
- Content maximum: 1200 px; reading maximum: 720 px.
- Outer gutter: 16 px on mobile and 32 px from 720 px.
- Breakpoints are content decisions, not device names: 720 px for multi-column content and 960 px for desktop navigation and large compositions.
- Radius is deliberately restrained: 0 px default, 2 or 4 px when grouping benefits from it, fully round only for avatars and circular status marks.
- Borders are 1 px; focus rings are 3 px with a 3 px offset.

### Elevation and motion

- Separation normally comes from surface and border changes, not shadow.
- The mobile menu may use one low, broad shadow because it overlays content.
- Motion durations: 120 ms fast, 180 ms standard, 280 ms slow.
- Only color, background, border, disclosure, and small positional feedback may animate.
- Under `prefers-reduced-motion: reduce`, smooth scrolling is disabled and transitions collapse to effectively zero.

## Typography

Manrope is the primary family; IBM Plex Mono is reserved for metadata, labels, code, and technical markers. Both cover Latin and Cyrillic in the selected weights.

| Style      | Mobile   | Desktop maximum | Weight / line height | Use                           |
| ---------- | -------- | --------------- | -------------------- | ----------------------------- |
| Display    | 42 px    | 92 px           | 700 / 0.98           | Home statement only           |
| H1         | 39 px    | 76 px           | 700 / 1.00           | Page title                    |
| H2         | 30 px    | 52 px           | 700 / 1.08           | Major section                 |
| H3         | 20 px    | 28 px           | 700 / 1.20           | Tile and subsection title     |
| Body large | 17 px    | 22 px           | 400 / 1.60           | Introductory copy             |
| Body       | 16 px    | 16 px           | 400 / 1.70           | Reading copy                  |
| Label      | 12 px    | 12 px           | 600 / 1.50           | Eyebrow and compact state     |
| Code/meta  | 12–14 px | 12–14 px        | 400–600 / 1.50       | Dates, tags, technical labels |

Rules:

- Headings wrap naturally and have no fixed height or truncation.
- Body copy stays within 720 px and aims for roughly 55–80 characters per line.
- Russian never receives a smaller font to fit a component.
- Uppercase is limited to short mono labels. Sentences and navigation remain mixed case.
- Controls allow at least 30 percent label expansion; labels may wrap when the action remains clear.
- Technical identifiers may remain in English inside Russian copy when that is the natural developer vocabulary.
- Locale controls use `EN` and `RU`, never flags.

## Component inventory

### Actions and identity

- `Button`: primary, secondary, and quiet appearances; default, hover, focus, pressed, disabled, and loading states. Loading preserves label width and exposes a textual status.
- `IconButton`: 44 px minimum, visible accessible name, icon swap property, no icon-specific variant explosion.
- `Link`: inline and standalone arrow forms; underline or positional cue must survive without color.
- `Badge` and `Tag`: short status or technology metadata, never a substitute for explanatory text.
- `Avatar`: portrait and initials fallback. Missing public media is omitted instead of rendered as a text placeholder.
- `ThemeToggle`: two-state control with current theme announced programmatically.
- `LanguageSwitcher`: explicit text labels; current locale uses `aria-current`.

### Forms

- `TextField` and `Textarea`: persistent label, optional hint, default, hover, focus, filled, disabled, error, and success contracts.
- `Checkbox`: native semantic input with a label that expands the clickable area.
- `FormMessage`: information, success, warning, and error variants with an icon/label as well as color.
- Errors appear next to the relevant field and in an overall summary when submission fails. Focus moves to the summary or first invalid field after submit.

### Navigation

- `Header`: sticky, translucent canvas layer, brand, desktop navigation, locale, and theme.
- `NavigationItem`: default, hover, focus, and current state.
- `MobileMenu`: native disclosure in the prototype; closes after navigation in production and returns focus to its trigger when dismissed.
- `Footer`: concise positioning, route groups, locale-equivalent links, and contact channels.

### Content and evidence

- `EvidenceFigure`: unmodified source image, stable caption, alt text, and optional source note.
- `AnnotatedScreenshot`: screenshot, numbered explanation, and a statement of what the frame proves.
- `ProofRow`: compact verified facts without decorative metric cards.
- `CaseDiagram`: ordered user or system flow using real steps and no invented values.
- `ExperienceTimeline`: period, role, organization, and bounded responsibility summary.
- `ArticleCard`: title, calculated reading time, summary, topic, locale pair, and editorial status. Production renders only `published` items.
- `ProjectCard`: retained only for bounded index use; long evidence stories use `WorkFeature` and `EvidenceFigure`.
- `Quote`: exact excerpt and attribution; it never paraphrases a recommendation inside quotation marks.
- `Callout`: info/status label, title, short body, and optional action.
- `Breadcrumb`: visible current location and linked ancestors.
- `ContactIntent`: `job-opportunity`, `project-consulting`, or `other`; the job option is selected first.

The complete visual state board is [states.html](prototype/states.html).

## Composition patterns

- `SectionHeading`: eyebrow, title, and optional explanatory copy aligned as one responsive unit.
- `TileGrid`: one column first; 2/3/4 columns only when the contained evidence benefits.
- `EditorialSplit`: text/evidence pair that collapses into reading order on mobile.
- `CaseFacts`: three concise facts before long case copy.
- `ReadingLayout`: 720 px article/case measure with full-width evidence allowed between sections.
- `ContactSplit`: direct channels before or beside the short form, depending on width.
- `WorkFeature`: asymmetric evidence and explanation without tile decoration.
- `ArchitectureDiagram`: host, editor managers, and canvas/runtime boundary.
- `PerformanceDiagram`: before/after representation with explicit trade-off text.

## Tailwind and Vuetify contract

Tailwind and Vuetify are compatible when they share tokens and have clear ownership:

- CSS custom properties are the runtime source of semantic theme values.
- Tailwind utilities consume those properties for page composition, spacing, responsive layout, and local typography.
- Vuetify receives the same semantic values through its theme configuration and owns behavior for selected complex controls.
- Component wrappers expose product-level props and states. They may apply Tailwind classes to stable outer layout, but do not depend on fragile Vuetify internal DOM selectors.
- Vuetify's unused component styles are excluded by its normal tree-shaken component/directive imports. A global utility bundle with all possible classes is not accepted.
- `!important` and deep selectors require a documented exception; repeated exceptions mean the wrapper or token bridge is wrong.

Initial mapping:

| Design role     | CSS                     | Tailwind alias           | Vuetify role    |
| --------------- | ----------------------- | ------------------------ | --------------- |
| Canvas          | `--color-canvas`        | `bg-canvas`              | `background`    |
| Surface/default | `--color-surface`       | `bg-surface`             | `surface`       |
| Text/primary    | `--color-text-primary`  | `text-primary`           | `on-background` |
| Action/brand    | `--color-action-brand`  | `bg-brand`               | `primary`       |
| Error           | status error variables  | `text-error`, `bg-error` | `error`         |
| Border/strong   | `--color-border-strong` | `border-strong`          | wrapper token   |
| Focus/ring      | `--color-focus-ring`    | `ring-focus`             | wrapper token   |

This mapping is a contract for the later Nuxt scaffold; no Code Connect file is created before real Vue component paths exist.
