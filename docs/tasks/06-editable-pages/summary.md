# 06 — Page copy managed through CMS

The CMS now edits Home, About, career history, tools, principles, Portfolio/Blog introductions, Contacts, sidebar, shared callout and Privacy, in addition to cases/articles/profile. Both names, portrait, author attribution and metadata use the profile. [Editing guide](../../operations/content.md).

`content/settings/pages.json` owns validated EN/RU data; i18n holds short UI labels. Career months are validated before build and may have an empty end for a current position. Portraits must exist under public images. Removed the duplicate Content collection and unused labels.

Public checks exposed redirecting canonical URLs; directory URLs now agree across sitemap/RSS/OG/schema/navigation and are tested for direct HTTP 200. YAML 1.2 frontmatter accepts ordinary date strings/BOM/CRLF and rejects executable engines before parsing. Patched available Sharp/compression advisories; [two high and one moderate tooling advisories remain](dependencies.md).

Lint, types, SSG, **43 unit tests**, a full local **49-test browser run**, and two final targeted Privacy checks passed. Coverage is 100% in twelve selected pure modules; Fallow core findings were zero. Final PR/master CI also passed 43 unit and 49 browser checks. [Review](review.md) records limits; [Release/publication 1.0.1](../07-launch-audit/summary.md) was verified after merge.

The owner performs the first personal-token CMS write. Vercel authorization was still unresolved at this historical stage and Sites required explicit publication; task 08 subsequently established automatic deployment. Domain connection remains the final launch task.
