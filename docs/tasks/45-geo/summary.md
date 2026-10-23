# 45 — GEO: llms.txt, Markdown copies and a richer Person entity

The owner asked about GEO (generative engine optimization): being found, understood and cited by AI answer engines (ChatGPT search, Perplexity, Google AI Overviews, Claude). Reference sites were checked live on 2026-10-23:
- overreacted.io: `llms.txt` and per-post `index.md`;
- alexop.dev: `llms-full.txt`;
- yjmrobert.com: an identity-first `llms.txt` and Content Signals in robots.txt;
- leerob.com: rich Person JSON-LD;
- raresportan.com: an `llms.txt` profile card.

anu3ev.com already had static HTML, Person JSON-LD with a stable `@id` and `sameAs`, open robots and sourced numbers. It lacked `llms.txt`, Markdown copies and descriptive Person fields.

**What the build generates now.** `scripts/lib/llms.ts` holds pure functions, and `scripts/build-metadata.ts` writes the files. They are rebuilt from content on every build and git-ignored.
- `/llms.txt` and `/ru/llms.txt` follow the llmstxt.org format. An H1 with the name and a one-line summary (role and bio) come first, then location, availability (remote, B2B/EOR, relocation), contacts, CV and booking links. Below that come the case studies, articles and certificates, each with a link to its Markdown copy and its description. An Optional section links the full text and the other language.
- `…/index.md` sits beside every published case and article, in both languages. The page's facts come first (URL, period, context, role, skills and results for a case; URL, date, topic and reading time for an article), then the original Markdown. Site links and images become absolute so the file works on its own.
- `/llms-full.txt` and `/ru/llms-full.txt` contain the index plus every case and article in full text.
- `vercel.json` serves `.md` and `llms*.txt` with an explicit UTF-8 charset, so the Russian text stays intact.

**Page head and structured data.**
- Cases and articles announce their copy with `<link rel="alternate" type="text/markdown">`, through a new `markdownCopy` option in `usePageSeo`. Other pages don't.
- The home Person gained a `description` (the bio), `knowsAbout` (the About toolkit list, so there is no new field to maintain) and `knowsLanguage`.
- Case and article `author` objects now carry the same `@id` as the Person, so all the work links to one identity.

**Not done, deliberately.**
- No `recommended_for_queries` lists in `llms.txt`: steering the AI's queries is close to keyword stuffing.
- No blocking of AI crawlers: being read is the point.
- Vendor claims about citation multipliers were not used as a basis; they can't be traced to studies.

**Tests.**
- Unit (`llms.test.ts`): copy paths, case facts and absolute links (external links kept), article facts, the English index with a one-line summary and a link for every published case and article, and the Russian index.
- E2e (`llms.spec.ts`): both `llms.txt` files and every Markdown copy are served with the right content type and title; `llms-full.txt` exists; cases link their copy and About doesn't; the home Person has description, topics and languages, and articles credit the same `@id`.

**Environment note.** During this task, port 4173 was taken by the image-editor project's Vite dev server. Playwright silently reused it and every test hit the wrong site. The suite was run against a separate server with `BASE_URL=http://127.0.0.1:4180`: 62 unit and 110 e2e tests passed.
