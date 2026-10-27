# Deployment, releases and domain

Production: **https://anu3ev.com/**. CMS: [/admin/](https://anu3ev.com/admin/). `www.anu3ev.com` and `anu3ev-com.vercel.app` redirect permanently to it.

Hosting uses the existing **Vercel Hobby** workspace, `anu3ev's projects`. Project: `anu3ev-com`, ID `prj_8EbuZYY6ZGiQe6FqepSdnzpHujEB`. Connected repository: `Anu3ev/anu3ev.com`; production branch: `master`. No paid trial, database, deploy hook or personal deployment token is required.

## Automatic publication

Vercel builds each Git push. Merging a PR into `master` updates production automatically. CMS content changes also deploy after reaching `master`, without a version bump. Drafts remain outside the public export.

`vercel.json` defines the frozen pnpm install, `pnpm check && pnpm build`, `.output/public`, trailing slashes and security/cache headers. Node is **24.x**, with package requirement **24.15+**. The canonical origin is `https://anu3ev.com`, the default in `shared/site.ts` used by local builds, Vercel and GitHub release archives. `NUXT_PUBLIC_SITE_URL` can override it; on Vercel it must be a **Config** variable (a Secret cannot carry the `NUXT_PUBLIC_` prefix). The `vercel.app` alias redirects through a host rule in `vercel.json`.

The Vercel build validates content, ESLint, TypeScript and unit contracts before generating HTML. GitHub also runs browser/axe checks and the real pagination fixture. Wait for green PR checks before merging. Branch protection and Vercel deployment checks are **not configured**; the workflow is not claimed to enforce a merge gate.

The initial import deployed master `3020b2779bf6aafe051fb8938295b078452971e0` with version 1.0.1.

## Versioned releases

Increase `package.json.version` to a higher stable `major.minor.patch`, open a PR, wait for checks and merge. After the master quality job succeeds, the same workflow creates `vX.Y.Z`, a GitHub Release and `anu3ev-portfolio-vX.Y.Z.tar.gz` from its exact tested export. An unchanged version deploys without another Release. Tags cannot move to another commit.

Vercel and GitHub build the same commit independently. Deployment can finish before the Release job. This is Git-push deployment paired with versioned releases, not another workflow triggered by a `GITHUB_TOKEN`-created Release. Compare the Release commit with public `/version.json`; byte-for-byte equivalence of the independent builds is not assumed.

## Verification and recovery

Use a fresh guest browser to check `/`, `/ru/`, a case, an article, `/admin/`, sitemap, robots, both RSS feeds and `/version.json`. Unknown paths must return HTTP 404. Sitemap/canonical URLs must return 200 without redirects. `version.json` records the version and `VERCEL_GIT_COMMIT_SHA` or `GITHUB_SHA`; a local build without either records `null`.

Check Vercel Deployments and GitHub Actions for failures. Correct the source through a PR; do not rerun a successful production publish job merely for diagnostics. Restore previous content with a reviewed revert PR so the Git integration publishes it. Dashboard rollbacks can alter automatic domain assignment; consult Vercel's instructions before using them.

Preview deployments retain default protection. The production alias is public: an owner login or bypass does not prove public access. Run `BASE_URL=https://anu3ev.com pnpm test:e2e` for production verification after installing Chromium. The suite also builds its isolated local pagination fixture.

## Custom domain

`anu3ev.com` uses Vercel nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`); the registrar is Zomro, which only exposes the nameserver setting. Vercel therefore hosts the DNS zone: apex and `www` records are managed in the Vercel project, and the previous Zomro `MX`/`mail` records were not carried over because that mail host no longer accepted SMTP. Recreate them in Vercel DNS before using mail on this domain. Vercel issues the Let's Encrypt certificate automatically.

References: [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), [environments](https://vercel.com/docs/deployments/environments).
