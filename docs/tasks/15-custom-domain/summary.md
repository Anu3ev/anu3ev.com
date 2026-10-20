# 15 — Custom domain

Version **1.0.13** makes `https://anu3ev.com` the site's canonical address.

**DNS.** Zomro (the registrar) only exposes nameservers, so the owner pointed `anu3ev.com` to Vercel DNS (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Before the switch the apex, `www` and `mail` all pointed to `45.147.197.150`, which no longer served HTTP and had SMTP closed; the old `MX`/`mail` records were not recreated. After propagation Vercel served the apex with a Let's Encrypt certificate (checked against `216.198.79.65`).

**Vercel.** `anu3ev.com` is the production domain. `www.anu3ev.com` was added with a **308** redirect to the apex. `anu3ev-com.vercel.app` redirects with a permanent host rule in `vercel.json`, so the policy is versioned and reviewed with the code. The old `NUXT_PUBLIC_SITE_URL` variable was a write-only Secret, which Vercel does not allow with a `NUXT_PUBLIC_` prefix and cannot convert; the canonical origin therefore lives in `shared/site.ts`, used identically by local, Vercel and release builds.

**Code and docs.** `DEFAULT_SITE_ORIGIN`, `.env.example`, README and the operations guides use the new domain.

Validation: `pnpm check` (content, ESLint, types, **51 unit tests**), `pnpm build`, **66 browser/axe checks** ([report](reports/browser.json)). The export has no `anu3ev-com.vercel.app` reference; canonical, Open Graph, the 28-URL sitemap, robots and both RSS feeds use `https://anu3ev.com`. 
**Production (1.0.13, commit `b9d54e4`).** Home canonical, `og:url` and hreflang, all 28 sitemap URLs, both RSS feeds and robots use `https://anu3ev.com`; `www.anu3ev.com/work/` returns 308 to `https://anu3ev.com/work/`. The first `vercel.app` rule (`/:path*`) redirected `/version.json` but not `/` or trailing-slash pages, so **1.0.14** uses `/(.*)` → `https://anu3ev.com/$1`.
