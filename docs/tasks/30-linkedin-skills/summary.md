# 30 — Case skills from LinkedIn

The owner pointed out that some case "stack" items were not skills ("CommonJS storefront library", "CommonJS cart API"), and asked to take skills from the LinkedIn Projects section and to show only a few on cards, as LinkedIn does ("JavaScript, Vite and +18 skills").

**Source.** The "Associated skills" list of each project on the owner's LinkedIn Projects page, read on 2026-10-21. The lists are copied verbatim and in LinkedIn's order, because that order decides which skills lead the card. The personal VPN project is on LinkedIn but not on the site.

| Case | LinkedIn project | Skills |
|---|---|---|
| Open-source image editor core | Image Editor Library — TypeScript & Fabric.js | 20 |
| Product image editor | Vue Product Image Editor at inSales | 12 |
| Code editor | Code Editor at inSales | 17 |
| Visual site editor redesign | Visual Site Editor Redesign at inSales | 15 |
| Abandoned carts | Abandoned Carts paid product… | 15 |
| CommonJS storefront library | CommonJS Storefront Library | 10 |
| Storefront product loading | Faster Product Loading and Caching… | 10 |
| Product options | Product Options and Add-ons… | 9 |
| Multi-warehouse carts | Multi-Warehouse Carts for Wholesale Buyers | 9 |
| Form protection | not on LinkedIn yet | kept its own list without "CommonJS storefront library" |

Skill names are the same on Russian pages, as LinkedIn shows them.

**Display.**
- Cards show the first three skills and then "+N more" / «ещё N». The count is plain text, not a chip with a border, so it does not read as a skill.
- The case page lists every skill under "Skills" / «Навыки» (previously "Built with" / «Стек»).
- The schema allows up to 20 skills (LinkedIn's per-project limit), and the CMS field is now "Skills" with a hint about the order.

**Tests.** `project-skills.spec.ts` takes the case with the longest list. It checks that its card shows exactly the first three skills plus the right "+N more", and that its case page lists all of them in order.

**Reorder (2026-10-23).** An external review noted that several cards led with weak skills ("JavaScript, Vite, Technical Documentation"; "Front-End Development"). With the owner's approval, the leading three were reordered **on LinkedIn itself**, so both places stay in sync:

| Case | First three |
|---|---|
| Image editor core | TypeScript, FabricJS, HTML Canvas |
| Product image editor | Vue 3, TypeScript, FabricJS |
| Code editor | Monaco Editor, TypeScript, Liquid |
| Visual site editor | Vue.js, TypeScript, Complex UI |
| Abandoned carts | Vue.js, JavaScript, Data Visualization |
| CommonJS library | JavaScript, Web Performance, Webpack |
| Product loading | JavaScript, IndexedDB, Web Performance |
| Product options | JavaScript, API Development, AJAX |

Multi-warehouse carts kept its order. Nothing was added to or removed from any project. The site lists were copied again from the saved LinkedIn lists, and a script confirmed every skill set was unchanged.
