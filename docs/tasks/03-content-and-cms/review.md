# Content and CMS self-review

Checked source evidence, data models, actual Nuxt queries and editing behavior. Shared schemas in `shared/content-schema.ts` give CMS changes the same build-time contract used by Nuxt Content.

Corrections:

1. A UI `published` filter was insufficient because static Nuxt Content exposes its SQL dump. Exclude draft/future sources before parsing/database creation. The real built database contained 6 published article translations, 10 project translations and no draft rows; draft-example marker/slug were absent from the public export.
2. A UTC runner could delay publication relative to the owner. Shared `getPublicationDate` uses Asia/Tbilisi; calendar-day boundaries are tested.
3. Separate EN/RU collections would require two commits for a translation pair. Native Sveltia i18n uses `content/{{locale}}`, shared slug/publication flag and a hidden locale field, edited as one record.
4. Without an OAuth server, retain only working token login. Removed the inactive OAuth action and an unsupported legacy locale option found by browser validation. Configuration warnings became zero.
5. Copy the pinned CMS bundle and license from npm to the site. Login does not require an executable CDN request; `import.meta.resolve` exposes the real asset dependency to analysis tools.
6. Replaced the previous preview server with http-server so the app's custom `404.html` is returned with actual HTTP 404, verified on a direct draft request.
7. Validate locale/filename agreement, complete published bodies, safe Markdown, image paths and translation pairs at external boundaries. Meaningful unit tests and actual V8 coverage support these contracts.
8. Gray-matter and Zod belong to the content module dependencies. An unused YAML package was removed at this stage; a deliberate YAML 1.2 parser was added later in task 06. The public static export needs no runtime npm install.

The supported PAT login stores its token in the browser; pre-1.0 CMS upgrades require review. No authenticated GitHub write with the owner's personal token was performed or claimed. Copy/metrics were checked against concrete sources; entire private notes and private repositories were not published. This was author self-review, without an independent reviewer.
