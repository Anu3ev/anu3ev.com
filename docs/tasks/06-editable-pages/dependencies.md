# Проверка зависимостей

Фактический `pnpm audit --json` сначала вернул 6 high + 1 moderate. Исправлены четыре доступных advisory: Sharp обновлён **0.34.5 → 0.35.5**, compression **1.8.1 → 1.8.2**. Обычный update не исправил compression: Nuxt CLI → serve закрепляет точную старую версию, поэтому в `pnpm-workspace.yaml` добавлен целевой `serve>compression` override.

Sharp используется при обработке SVG/WebP и social cards во время build. Патч закрывает известные проблемы его libvips/libheif/librsvg: [libvips](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Compression patch устраняет утечку при преждевременном закрытии ответа: [advisory](https://github.com/advisories/GHSA-vc2v-76pw-4v95).

Повторная проверка: **2 high + 1 moderate**, critical 0; audit exit code **1**, не pass. У этих записей на момент проверки нет исправленной опубликованной версии:

| Пакет / advisory | Фактическая цепочка и область |
| --- | --- |
| node-forge 1.4.0 · [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) | Nuxt → nitropack → listhen; TLS/dev-server tooling. Публичный export не содержит Node-сервера, локальный dev привязан к HTTP 127.0.0.1. |
| braces 3.0.3 · [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | Nuxt Content → micromatch; matching находится в `dist/module.mjs` на стадии build. Globs задаются конфигурацией, slug проверяется allowlist; поисковый запрос посетителя не передаётся в glob parser. |
| sprintf-js 1.0.3 · [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) | gray-matter → js-yaml → argparse; форматирование CLI. Публикационный reader явно использует YAML 1.2, CLI js-yaml не вызывается. |

Это классификация текущего использования, не утверждение об отсутствии всех рисков. Advisory не скрывались и не исключались из audit. После выхода патчей их нужно обновить; перед включением серверного runtime или новых недоверенных входных данных область применения проверяется заново. Install также сообщает существующие peer/deprecation notices Nuxt toolchain; успешный lint/typecheck/SSG не выдаётся за отсутствие этих notices.

Отдельно проверена граница frontmatter. Legacy parser превращал обычное `date: 2026-10-20` в JavaScript Date, что противоречило контракту ISO string. Reader использует `yaml` 2.9.1; BOM/CRLF и даты без кавычек покрыты тестами и реальной Nuxt fixture-сборкой. Tagged JavaScript отклоняется **до** выбора встроенного executable engine gray-matter. Метаданные на выходе reader имеют тип `unknown` до Zod validation.

Sveltia bundle остаётся зафиксированным 0.248.1 и self-hosted; его MIT license копируется в `/admin/LICENSE.txt`. Для локальных Inter fonts в публичную сборку включён исходный `public/licenses/Inter-OFL.txt` из pinned Fontsource package 5.3.0.
