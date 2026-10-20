# Initial publication and access limits

Historical record of task 05. The Vercel access limitation described here was resolved in [task 08](../08-github-deployment/summary.md); current production and automatic deployment are documented in the [operations guide](../../operations/deployment.md).

The existing Vercel Hobby team's Git import returned `403 forbidden: You don't have permission to create the project`. No local CLI credentials existed. At this stage the owner had not completed browser sign-in. This was an external API authorization failure, not a Nuxt build error. Automatic review first requested evidence of the authorized public payload; after read-only inspection the API call was allowed.

The public fallback was Sites project `appgprj_6ad6aec278ec8191a1a7e24b47e9ec53`, at `https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site`. The user explicitly requested public internet access; the GitHub source remained private. No storage, paid resources or runtime secrets were added.

The standard Sites `site-workflow.mjs` calls `git add --all` in `saveSource()`, conflicting with the user's direct prohibition. Sources were committed using a temporary index, then the same revision was pushed through normal Git transport with a short-lived credential passed through hidden stdin/environment. Credentials were not written to files, shell arguments, Git config or docs. The standard `package-site.mjs` packaged the unchanged build. A failed push or mismatched remote HEAD blocked saving.

Native Sites tools publish explicitly saved snapshots. This provided public access but did not establish GitHub-to-hosting automatic updates. Short-lived credentials were not persisted into CI. `vercel.json` prepared the later Git integration without changing stack or content.

DNS observed on 20 October 2026: A `45.147.197.150`; nameservers `ns1.zomro.net`, `ns2.zomro.ru`, `ns3.zomro.com`, `ns4.zomro.su`. Records were not changed without registrar access; canonical used the reachable host.
