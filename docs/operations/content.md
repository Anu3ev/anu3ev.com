# Editing content

Open `/admin/` on the published site. Sveltia CMS **0.248.1** is pinned in the lockfile. Its JavaScript and MIT license are served from the site, without a login-time CDN request. Sveltia is pre-1.0, so upgrades require review; it is not automatically replaced with `latest`.

**Production uses Vercel Hobby.** Changes reaching `master` automatically build and deploy to [anu3ev-com.vercel.app](https://anu3ev-com.vercel.app/). Articles/projects use an editorial workflow. Drafts stay outside the public export; publication follows a successful build and is not immediate. [Deployment guide](deployment.md).

## First sign-in

1. Create a GitHub **fine-grained personal access token** for `Anu3ev/anu3ev.com` only.
2. Grant repository **Contents — Read and write** and **Pull requests — Read and write**. GitHub adds Metadata read automatically. PR access supports the editorial workflow.
3. In the CMS, select **Sign In Using Access Token** and enter it in the login form.

The token remains in this browser's localStorage, not source or generated files. Use a trusted device and sign out on shared devices. GitHub enforces access permissions; there is no shared admin password. OAuth is disabled because this login method does not need an OAuth server.

## Articles

The **Articles** collection combines English and Russian in one entry, saved to `content/en/posts/:slug.md` and `content/ru/posts/:slug.md`. Locale is filled automatically; slug, publication date and published state are shared.

Complete both versions of title, description, body, cover alt text, category, tags and reading time. Prefer WebP covers under 200 KB at 1200×630. Use H2/H3 in body copy; the page creates H1. Put HTML examples inside fenced code blocks.

New entries default to `published: false`. Saving creates an editorial PR; after review and enabling publication, both translations publish together. Do not change an existing public slug without a separate redirect.

A future date is not a timer. Entries are excluded until that date in **Asia/Tbilisi**, then appear after the next successful build. A static site cannot publish them without another build.

## Projects

The **Projects** collection includes case copy, category, role, period, stack, cover/alt, ordering and featured status. Home shows the first published featured project by `order`.

Optional `repository` and `demo` fields must contain real public HTTPS URLs. A demo link does not embed a heavy editor in the page. The commercial Vue editor and open-source FabricJS library remain separate cases.

## Profile

Under **Site settings → Profile and contacts**, edit English/Russian names, photo, email, social links, location, availability, headline and bio. Prefer a square WebP portrait at 600×600 under 200 KB. About, author attribution and metadata use the same profile and photo.

## Page copy and career history

Open **Site settings → Page copy and career history**, then English or Russian. Collapsed groups correspond to pages; values live in `content/settings/pages.json`.

| Group | Editable content |
| --- | --- |
| Home | SEO title, pinned note and profile topics |
| About | Heading, introduction, biography, tools, career and principles |
| Portfolio / Blog | Listing headings, introductions and Portfolio summary facts |
| Contacts | Introduction, email note and working arrangements |
| Right sidebar | Short bio, current focus and technologies |
| Collaboration / Contact callout | Invitations to collaborate and shared contact copy |
| Privacy | Updated date, hosting, correspondence and browser storage |

Career entries need company, role, description and `YYYY-MM` months. A blank end means a current position; reversed periods fail validation. Dates render automatically. Update factual changes in both locales. Headings allow 4–120 characters, body text 20–1600. These fields are plain text; use Markdown articles/cases for formatted long-form material.

Settings use simple commits to master; cases/articles use the editorial workflow. Content is validated before build, but mandatory branch protection is not configured. Navigation labels, layout and program behavior remain reviewed source changes.

Manual Markdown uses ordinary YAML frontmatter between `---` lines. Quoted/unquoted ISO dates, BOM and CRLF are supported. Executable tagged frontmatter is rejected before parsing. Internal page links end with `/`, for example `/ru/work/image-editor/`; image and RSS file URLs do not.

## Publication checks

Nuxt Content and `pnpm check:content` share schemas for URLs/slugs, real dates, existing images, complete copy, no second H1, active HTML or unsafe link schemes. Every published document needs its published translated counterpart. Drafts/future entries are excluded **before** the public SQLite database is generated, not merely hidden from a listing.

The same Markdown/JSON can be edited directly in GitHub. Do not add tokens or entire private notes to content.

## Verified scope

The login form, native i18n configuration, self-hosted bundle, absence of configuration warnings and draft exclusion from the actual database/export were verified. An authenticated write using the owner's personal GitHub token was not performed; no token was requested or extracted. The owner performs that first sign-in.
