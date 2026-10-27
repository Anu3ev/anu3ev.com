# 51 — Prepare the repository to go public

The owner decided to make the repository public, for free CI minutes and as proof of how the site is built. This task prepares it. The visibility switch itself is a separate owner action.

## What changed

- **`LICENSE`:** MIT for the code. The README says that the texts, images and CV files are not covered by it, and that each recommendation belongs to its author.
- **The README is written for visitors:** what the site is, the stack, how quality is checked, how to run it, and how the work is organised (the task board, the roadmap and plan/summary per task).
- **The footer links to the source code** ("Source code ↗" / «Исходный код ↗»). It is an external link, so it opens a new tab with `noopener noreferrer`. The URL lives in `shared/site.ts`.
- **Docs mentions cleaned:** the planning docs no longer link to the private mockup tool, and the task 19 summary no longer names the tool that ran the copy checklist. Commit history is left as it is.

## Security review before going public

**History.** Every commit was scanned:
- no tokens, keys or private keys;
- `.env.example` holds only the site URL;
- both CV PDFs were committed once, already without a phone number;
- the only unpublished document is the `draft-example` test fixture.

**Admin panel.** `/admin/` and its `config.yml` are already public on the site, so a public repo reveals nothing new about them.
- **Sign-in:** saving anything needs a GitHub fine-grained token with write access to this repository, and GitHub checks it on every request. There is no shared password and no backend to attack.
- **The main risk is the token** sitting in the browser's localStorage on the site's own origin. A script injected into anu3ev.com could read it.
- **Defences in place against injected scripts:**
  - Markdown with raw HTML or `javascript:` links fails the build;
  - pages never use `v-html`;
  - JSON-LD is escaped;
  - the CMS bundle is served from the site, not a CDN;
  - the site loads no third-party scripts.
- **Gap: there is no Content-Security-Policy header.** A CSP would block an injected script even if one got through. That is proposed as its own task.

**CI.** The workflow runs on `pull_request`, not `pull_request_target`, with `contents: read`.
- Pull requests from forks get no secrets and a read-only token.
- Only a push to `master` can run the release job, which has `contents: write`.
- GitHub asks for approval before running workflows from first-time contributors to a public repository.

**After the switch, owner settings:**
- protect `master` against force pushes and deletion (free for public repositories);
- turn on secret scanning with push protection, and Dependabot alerts;
- check that Vercel's protection for pull requests from forks is on, so a fork cannot deploy a preview without approval;
- give the CMS token an expiry and access to this repository only.

## Tests

- E2e: the footer links to the repository in a new tab in both languages.
- The existing external-link and accessibility suites cover the new link's attributes and the footer layout.
