# anu3ev.com

Портфолио Александра Ануфриева на Nuxt 4, Vue 3, TypeScript, Tailwind CSS и Nuxt Content. Сайт собирается в статический HTML; серверная база данных для хостинга не нужна.

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

Решения и последовательность работ: [docs](docs/README.md). Публичная публикация, админка и операционные инструкции добавляются соответствующими этапами; наличие команды в плане не означает, что проверка уже пройдена.
