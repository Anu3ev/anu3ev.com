# GitHub deployment

## Scope

Connect the existing private `Anu3ev/anu3ev.com` repository to the owner's existing Vercel Hobby workspace. Keep `master` as the production branch and publish the static Nuxt export. Do not enable a paid trial or add unrelated integrations.

## Order and acceptance

1. Import this repository through the authenticated Vercel dashboard. Preserve the GitHub App's existing repository selections and add only this repository if needed.
2. Confirm Node 24, the checked-in build settings, a stable public production URL and the canonical origin.
3. Release a new version through a reviewed PR and the existing GitHub quality/release workflow.
4. Verify that merging the PR automatically publishes the same commit, without a manual upload or deployment command. Check public access, `version.json`, SEO endpoints, localized routes, the CMS entry point and a real HTTP 404.
5. Document actual settings, verification evidence and any remaining domain limitation. Commit, push and merge this task before starting manual UI testing.

Manual UI testing and focus fixes are the next task. Translating the remaining repository documentation to English follows that task. New task documentation is written in English immediately.

## Deployment contract

Vercel's Git integration deploys pushes to `master`; GitHub Actions validates the export and creates a versioned Release when `package.json.version` increases. Content-only CMS commits also deploy. The Vercel build runs `pnpm check && pnpm build`, so invalid content, lint, types or unit contracts block its build. Browser checks run in GitHub and must pass before merging. Do not claim that branch protection or deployment checks are active unless they have actually been configured and verified.

The public origin must agree across canonical URLs, hreflang, Open Graph, JSON-LD, sitemap and RSS. Keep directory URLs with trailing slashes. Change the canonical origin to `anu3ev.com` only after DNS and HTTPS work.

References: [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), [deployment environments](https://vercel.com/docs/deployments/environments).
