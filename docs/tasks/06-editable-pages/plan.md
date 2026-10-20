# 06 — Editable pages

The administration review found a gap: cases, articles and profile were editable, but long About/Home/Contacts/Privacy copy and career history still lived in Vue/i18n. Move editorial data to bilingual `content/settings/pages.json`, keeping navigation and short UI labels in i18n. Ownership: JSON content, Zod pre-build validation, Vue presentation and Sveltia editor fields.

CMS groups cover Home, About/career/tools/principles, Portfolio, Blog, Contacts, sidebar, shared callout and Privacy. Both locales share schemas/widgets. Career dates support completed/current positions and reject reversed periods. The profile also owns Russian name and photo.

Before implementation, checked the requirement, existing CMS, readability/state/types/testing rules, actual copy and career sources. No new facts are added. Validate external inputs before SSG; public output contains no drafts or server credentials. At this stage the provider access limitation remained unresolved; it was later fixed in task 08.

Checks: schema/period boundaries, lint/types/SSG, full GitHub browser/axe suite and CMS configuration/public snapshot after publication. Review/corrections precede a separate PR/merge and patch release 1.0.1.

A no-redirect probe found `307 /blog → /blog/` while canonical still used `/blog`. Use one directory-URL policy across metadata, sitemap, RSS, schema, navigation and Vercel. Pass query/hash separately to Router. Normalize origin after runtime overrides; the fixture deliberately supplies a trailing slash to expose duplicate slashes in JSON-LD.
