# 03 — Content and administration

Created five full cases and three articles in English and Russian. [Source evidence and claim boundaries](sources.md). The commercial Vue editor is distinct from the open-source library; repository/demo links appear only where real public destinations exist.

Configured self-hosted Sveltia CMS 0.248.1 with projects, articles, media, profile settings, native paired translations, editorial PR workflow and GitHub token login. [Owner guide](../../operations/content.md). OAuth is disabled because token login does not need an OAuth server.

Shared Zod schemas validate content. Drafts/future entries are excluded before the public database. Markdown safety, local images, translation pairs and Asia/Tbilisi publication dates are checked. Preview returns the app's custom 404 with HTTP 404.

## Checks at this stage

- `pnpm check:content`: pass, 10 project translations, 6 article translations and 1 excluded draft.
- ESLint: pass, 0 warnings. Unit: **17 passed**, with 100% lines/branches/functions in four selected critical files, not the entire UI.
- Typecheck and final static build: pass without compiler diagnostics; 61 prerender entries.
- Browser: three articles → search for undo → one result → full Markdown article passed. The draft request returned a real 404; its expected HTTP error was not hidden as a runtime failure.
- CMS login/configuration/assets passed without configuration errors or warnings. Authenticated personal-token writes were **not run**.
- Read-only SQL inspection found 6 published article rows, 10 project rows and no drafts. The draft-example marker/slug was absent from SQL and `.output/public`.
- Fallow with actual `coverage-final.json`: pass; no complexity, unused files/exports, cycles, boundary or duplication findings. One inherited axe development-dependency notice remained for task 04. An initial unsupported lcov input was rejected and not counted as a successful audit.

Completed self-review, corrections and another pass. No independent review. CI/releases and public deployment followed in task 05.
