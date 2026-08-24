# anu3ev.com Project Tasks

Project facts and accepted decisions live outside the backlog:

- [Project documentation](../docs/README.md)
- [Project brief](../docs/product/project-brief.md)
- [Content inventory](../docs/product/content-inventory.md)
- [Decision records](../docs/decisions/README.md)
- Project workflow skill: anu3ev-project

## Project summary

anu3ev.com is a bilingual personal website for an experienced Frontend / Product Engineer. Its primary purpose is to demonstrate engineering skills, product thinking, professional experience, and real project outcomes to recruiters and engineering leaders. Secondary purposes are building professional authority through writing and receiving qualified client enquiries.

The website must feel authored rather than generated. It will use an editorial engineering visual language, restrained motion, reusable tile-based compositions, a dark default theme, a complete light theme, and a muted copper-orange accent. A small portrait may support trust, while projects and evidence remain the primary visual proof.

## Product goals

- Explain the developer's role, level, and value within the first viewport.
- Present selected work as detailed case studies rather than screenshot galleries.
- Publish technical and product-engineering articles.
- Provide a short path from any important page to a contact action.
- Support search visibility through useful content, structured routes, metadata, and strong technical performance.
- Provide complete English and Russian versions of every published page and article.
- Remain maintainable through a small design system shared by Figma and production code.

## Target audiences

1. Recruiters evaluating fit for international remote roles.
2. Engineering and product leaders evaluating experience and decision quality.
3. Founders or agencies considering a project or consulting engagement.
4. Developers discovering the site through technical articles.

## Technology constraints

- Vue.js with Nuxt 4.
- TypeScript in browser and server code.
- Tailwind CSS for utilities, responsive composition, and local layout.
- Customized Vuetify components for complex interactive behaviour.
- Pinia only for confirmed cross-page client state; it must not duplicate state already owned by Nuxt i18n or Vuetify.
- Nuxt i18n with English as the default locale and Russian under `/ru/`.
- Nuxt Content for version-controlled project, page, and article content unless a later ADR proves that a different CMS is required.
- GitHub as the source repository with automated preview and production deployment.

## Localization contract

- English canonical routes have no locale prefix.
- Russian canonical routes use `/ru/`.
- `?lang=en|ru` may exist only as an incoming alias that redirects to a canonical localized route.
- Every published item has complete English and Russian variants.
- The language switcher opens the equivalent current page and never falls back silently to the home page.
- Language is represented with text labels, not flags.
- Both locales use the same font families with high-quality Latin and Cyrillic coverage.

## Design and UX requirements

- Mobile-first layouts with documented behaviour from 320 px upward.
- WCAG 2.2 AA as the accessibility target.
- Visible focus, full keyboard operation, reduced-motion support, and comfortable touch targets.
- Dark and light themes implemented through semantic design tokens.
- Real content is introduced early; components must tolerate at least 30% text expansion.
- No decorative motion or generic AI-portfolio motifs without a clear communication purpose.

## Planned routes

| English | Russian | Purpose |
| --- | --- | --- |
| `/` | `/ru/` | Home |
| `/work` | `/ru/work` | Project index |
| `/work/:slug` | `/ru/work/:slug` | Project case study |
| `/writing` | `/ru/writing` | Article index |
| `/writing/:slug` | `/ru/writing/:slug` | Article |
| `/about` | `/ru/about` | Professional profile |
| `/contact` | `/ru/contact` | Contact form |
| `/privacy` | `/ru/privacy` | Privacy information |

## Task workflow

Tasks are grouped by responsibility:

- [`design`](design) defines product structure, visual foundations, component contracts, screens, and design validation.
- [`components`](components) implements the shared UI library and the Tailwind/Vuetify styling contract.
- [`frontend`](frontend) creates the Nuxt application, routes, content system, pages, SEO, and browser behaviour.
- [`backend`](backend) owns server-side lead submission, delivery, abuse protection, and operational contracts.
- [`deploy`](deploy) selects hosting and establishes CI/CD, environments, domain configuration, monitoring, and launch checks.

Complete tasks in numeric order within each area unless their `Depends on` field states otherwise. Design foundations and the homepage representative case precede broad component and page implementation. Hosting selection must precede provider-specific backend and deployment work.

## Task index

### Design

| ID | Task |
| --- | --- |
| DES-01 | [Complete Product Discovery and Content Inventory](design/01-product-discovery-and-content-inventory.md) |
| DES-02 | [Define Information Architecture and User Journeys](design/02-information-architecture-and-user-journeys.md) |
| DES-03 | [Create the Figma File and Lock the Library Scope](design/03-create-figma-file-and-lock-library-scope.md) |
| DES-04 | [Define the Visual Direction and Design Tokens](design/04-define-visual-direction-and-design-tokens.md) |
| DES-05 | [Define Multilingual Typography and Content Rules](design/05-define-multilingual-typography-and-content-rules.md) |
| DES-06 | [Build the Core Figma Component Library](design/06-build-core-component-library.md) |
| DES-07 | [Design the Homepage Representative Case](design/07-design-homepage-representative-case.md) |
| DES-08 | [Design Responsive Page Templates](design/08-design-responsive-page-templates.md) |
| DES-09 | [Create the Prototype and Run the Accessibility Audit](design/09-create-prototype-and-run-accessibility-audit.md) |
| DES-10 | [Prepare the Design Handoff](design/10-prepare-design-handoff.md) |

### Components

| ID | Task |
| --- | --- |
| CMP-01 | [Validate the Tailwind and Vuetify Styling Contract](components/01-validate-tailwind-vuetify-styling-contract.md) |
| CMP-02 | [Implement the Design Token and Theme Bridge](components/02-implement-design-token-theme-bridge.md) |
| CMP-03 | [Implement Core Interactive Components](components/03-implement-core-interactive-components.md) |
| CMP-04 | [Implement Navigation and Locale Controls](components/04-implement-navigation-and-locale-controls.md) |
| CMP-05 | [Implement Content Components](components/05-implement-content-components.md) |
| CMP-06 | [Implement the Contact Form UI](components/06-implement-contact-form-ui.md) |
| CMP-07 | [Document and Test the Component Library](components/07-document-and-test-component-library.md) |

### Frontend

| ID | Task |
| --- | --- |
| FE-01 | [Scaffold the Nuxt TypeScript Application](frontend/01-scaffold-nuxt-typescript-application.md) |
| FE-02 | [Implement i18n Routing and the Translation Contract](frontend/02-implement-i18n-routing-and-translation-contract.md) |
| FE-03 | [Implement Multilingual Content Collections](frontend/03-implement-multilingual-content-collections.md) |
| FE-04 | [Implement the App Shell and Route Structure](frontend/04-implement-app-shell-and-route-structure.md) |
| FE-05 | [Implement Website Page Templates](frontend/05-implement-website-page-templates.md) |
| FE-06 | [Implement SEO and Structured Data](frontend/06-implement-seo-and-structured-data.md) |
| FE-07 | [Define Pinia State Boundaries and UI Preferences](frontend/07-define-pinia-state-boundaries-and-ui-preferences.md) |
| FE-08 | [Integrate the Contact Form with the Server API](frontend/08-integrate-contact-form-with-server-api.md) |
| FE-09 | [Run the Frontend Quality and Performance Audit](frontend/09-run-frontend-quality-and-performance-audit.md) |

### Backend

| ID | Task |
| --- | --- |
| BE-01 | [Define the TypeScript Server Runtime](backend/01-define-typescript-server-runtime.md) |
| BE-02 | [Define the Lead Submission Contract](backend/02-define-lead-submission-contract.md) |
| BE-03 | [Implement the Contact Submission Workflow](backend/03-implement-contact-submission-workflow.md) |
| BE-04 | [Protect the Contact Endpoint from Abuse](backend/04-protect-contact-endpoint-from-abuse.md) |
| BE-05 | [Add Lead Observability and Privacy Controls](backend/05-add-lead-observability-and-privacy-controls.md) |

### Deployment

| ID | Task |
| --- | --- |
| DEP-01 | [Select the Hosting Platform and Record an ADR](deploy/01-select-hosting-platform-and-record-adr.md) |
| DEP-02 | [Set Up GitHub CI Quality Gates](deploy/02-set-up-github-ci-quality-gates.md) |
| DEP-03 | [Configure Preview and Production Deployments](deploy/03-configure-preview-and-production-deployments.md) |
| DEP-04 | [Configure Domain, DNS, TLS, and Redirects](deploy/04-configure-domain-dns-tls-and-redirects.md) |
| DEP-05 | [Configure Secrets and Environment Boundaries](deploy/05-configure-secrets-and-environments.md) |
| DEP-06 | [Set Up Analytics, Monitoring, and Search Tools](deploy/06-set-up-analytics-monitoring-and-search-tools.md) |
| DEP-07 | [Run the Production Launch Checklist](deploy/07-run-production-launch-checklist.md) |

## Definition of done for every task

- All listed deliverables exist and have been reviewed.
- Every acceptance criterion has direct evidence.
- English and Russian behaviour is covered where user-facing content is involved.
- Dark and light modes are covered where visual UI is involved.
- Relevant automated checks pass without warnings.
- New decisions that affect other areas are recorded in the appropriate task or ADR.
- No unrelated legacy cleanup is included.
