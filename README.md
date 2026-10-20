# anu3ev.com

Портфолио Александра Ануфриева на Nuxt 4, Vue 3, TypeScript, Tailwind CSS и Nuxt Content. Сайт собирается в статический HTML; серверная база данных для хостинга не нужна.

Публичный сайт: **https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site**. [Админка](https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/admin/). Сейчас это опубликованный Sites snapshot; автоматическая GitHub → hosting integration ожидает рабочих прав Vercel. [Точный статус и публикация](docs/operations/deployment.md).

Опубликован [v1.0.1](https://github.com/Anu3ev/anu3ev.com/releases/tag/v1.0.1) — точная CI-сборка. Проверено: 43 unit tests и 49 production browser/axe tests. [Результаты, screenshots и границы проверки](docs/tasks/07-launch-audit/summary.md).

Требуется Node **24.15+ LTS** и pnpm **10.33.2**. Версии зафиксированы в `.node-version` и `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Проверки и сборка:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Готовый сайт находится в `.output/public`. Публичные маршруты имеют английскую версию без префикса и русскую с `/ru`. Контент — в `content/en`, `content/ru`, настройки автора — в `content/settings/profile.json`.

Админка находится по `/admin/`: [первый вход и редактирование](docs/operations/content.md). Кейсы и статьи редактируются парой English/Русский через GitHub editorial workflow. Черновики исключаются до создания публичной базы.

`pnpm check` проверяет контент, ESLint, TypeScript и unit-тесты. Coverage относится к критичным чистым контрактам, а не всему UI. Решения и последовательность работ: [docs](docs/README.md).

Браузерные проверки: `pnpm exec playwright install chromium`, затем `pnpm test:e2e` (один worker). Тестовая пагинация создаёт отдельную временную сборку и не меняет публикации. `pnpm build` генерирует sitemap, RSS, social cards и responsive WebP. После локальной смены cover при работающем dev: `pnpm assets:prepare`.
