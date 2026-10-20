# External link behavior

Third-party HTTP(S) destinations must open in a new tab with `noopener noreferrer`. Audit profile/sidebar/contact links, project repository/demo actions and Markdown anchors. Keep internal routes, same-site absolute URLs, anchors and email actions in their existing navigation context. Preserve explicit author metadata on Markdown links.

Known profile destinations are validated HTTPS fields and use explicit native anchor attributes. A pure policy resolves the complete target/rel pair for ProseA and project actions against the canonical origin, including future same-site playgrounds. It must not throw for an unparseable editorial link or drop authored relationship metadata. Do not introduce a global click interceptor or routing abstraction.

The link audit also found a literal Privacy email despite the CMS-editable profile. Bind that existing email action to the same profile owner as the other contact links.

Validate content/lint/types/unit/SSG, add one browser regression for rendered link policies and actual native popup/opener behavior, and run the complete suite. The popup test may fulfill the external document locally to avoid making CI depend on a third-party service; report that distinction. Review every affected anchor, then commit/push/merge separately before the All topics task.
