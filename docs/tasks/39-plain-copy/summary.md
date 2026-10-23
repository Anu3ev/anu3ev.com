# 39 — Plain copy instead of slogans

From the external portfolio review: around the specific copy sat lines that "could be on anyone's site". With the `anti-cringe-copy` skill, every interface label (`messages.ts`) and every heading or short line in `pages.json` was checked in both languages, not only the nine the review quoted. Failing lines were rewritten with facts already on the site; no new claims. The decorations ("Personal space", "Pinned note", `<ideas /> → interfaces`, the page counter) are a separate task.

| Where | Old | Verdict | New | Reason |
|---|---|---|---|---|
| Home cover label | Crafting the interactive web / Фронтенд для сложных продуктов | rewrite both | Browser editors / Браузерные редакторы (short enough to stay clear of the cover shapes; Vue and TypeScript follow right below) | "crafting"; anyone test |
| Footer tagline | Thoughtful interfaces. Solid engineering. / Удобные интерфейсы и надёжный код. | rewrite both | Senior frontend engineer · Vue and TypeScript · Batumi, Georgia (RU likewise) | staccato slogan; anyone test |
| Sidebar sign | Built with care. | rewrite EN | Site built by + name | "built with care"; RU «Сайт собрал» already a fact |
| Profile column bio | Building at the intersection of engineering and experience. / Делаю сложные интерфейсы удобными. | rewrite both | I build browser editors and merchant tools with Vue and TypeScript. (RU likewise) | "at the intersection"; anyone test |
| About title | The person behind the pixels. / Кто я и чем занимаюсь. | rewrite both | Five years of frontend work at inSales. / Пять лет писал фронтенд в inSales. | cute; replaced with a fact |
| About intro | I care about what happens after the happy path. | keep | — | a real engineering stance, specific |
| Portfolio title | Work with a purpose. | rewrite EN | What I've worked on. | "with a purpose"; RU «Над чем я работал.» kept |
| Portfolio intro | Complex editors, useful tools, and the engineering that makes them feel simple. | rewrite EN | Editors, merchant tools and storefront work, from the first requirements to the details that make an interface easy to use. | triad of vague claims; now mirrors RU |
| Blog title | Thinking out loud. / Мысли вслух. | rewrite both | Notes from real frontend work. / Заметки из реальных задач. | anyone test |
| Blog / feed labels | Notes from the workbench, From the notebook, From my workbench | rewrite EN | Development notes, Latest | metaphor; matches RU «Заметки о разработке», «Свежее» |
| Contact title | Good work starts with a conversation. | rewrite EN | Get in touch. | anyone test; RU «Давайте познакомимся.» kept |
| Collaboration title | Based in Batumi. Built for distributed teams. | rewrite EN | Based in Batumi, working remotely. | staccato + "built for"; mirrors RU |
| Contact block (every page) | Let's build something thoughtful. / Давайте работать вместе. | rewrite both | Looking for a senior frontend engineer? / Ищете senior frontend-разработчика? | "thoughtful"; anyone test |
| Contact block body | Have a product challenge or an interesting role? Get in touch. | rewrite both | I'm open to remote work and relocation. Send me an email or book a call. (RU likewise) | facts: the offer and both ways to reach out |
| Privacy title | A little privacy, by design. | rewrite EN | Privacy. | cute; RU already «Приватность.» |
| 404 | This page wandered off. … Let's get you somewhere useful. | rewrite EN | Page not found. The address may have changed, or the page doesn't exist. | cute; RU already plain |

Kept after the check: the home bio and highlights (specific, with sources); the pinned title "Hard frontend problems, shipped and maintained." (a factual summary of the cases); the sidebar focus "Complex UI, owned end to end."; and all buttons and navigation labels.

**Tests.** The 404 test now expects "Page not found." The settings-driven page tests read the new copy from `pages.json`, so they cover it automatically.
