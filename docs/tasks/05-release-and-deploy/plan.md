# 05 — GitHub CI and versioned releases

Historical task plan. The initial Vercel authorization failure was subsequently resolved in task 08.

Validate the pipeline in a separate PR before the first production release. The neighboring image-editor workflow supplies the version-bump → tag/Release model. Do not publish this site as an npm package.

CI checks content schemas, ESLint, Nuxt types, unit tests, SSG, Chromium/axe and real pagination, with one browser worker. The release job consumes the exact tested archive instead of rebuilding. Official actions are pinned to commit SHAs, Node comes from `.node-version`, pnpm from `packageManager`. Permissions default to read-only; only the release job gets Contents write.

At this stage Vercel returned 403 and had no local CLI credentials. GitHub Pages was not enabled because initial configure-pages requires administration permission unavailable to the connector. Repository visibility stayed private; the separate hosting task recorded a supported public fallback.

Pre-publication inspection covered 131 tracked files: no environment file beyond public `.env.example`, private keys, token markers, other project source or entire Obsidian vault. The static export had no symlinks. These checks were not represented as a complete secret scanner or independent security audit.
