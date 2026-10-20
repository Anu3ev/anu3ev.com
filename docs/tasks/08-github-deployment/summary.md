# GitHub deployment

Project `anu3ev-com` in the existing Vercel Hobby workspace is connected to `Anu3ev/anu3ev.com`. Production: **https://anu3ev-com.vercel.app/**. CMS: **https://anu3ev-com.vercel.app/admin/**.

The first import deployed master `3020b2779bf6aafe051fb8938295b078452971e0` as version 1.0.1. Guest Chrome and unauthenticated requests confirmed public access, the production canonical, SEO endpoints and HTTP 404. The GitHub App retains its two prior repository selections and adds only this repository.

Version 1.0.2 aligns local/CI canonical metadata and both privacy pages with the production host. Local content/lint/types/43 unit tests and the static build passed. The versioned PR is the next verification of automatic publication; this summary will be updated with the actual merge, Release, production commit and browser result afterward.

No paid services were enabled. The custom domain still needs DNS access; the Vercel HTTPS address works independently. [Operating guide](../../operations/deployment.md), [review and limits](review.md), [plan](plan.md).
