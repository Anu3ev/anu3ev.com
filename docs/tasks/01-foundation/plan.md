# Последовательность задач

Каждая задача проходит: требования → реализация → проверки → самопроверка → исправления → повторный проход → summary → отдельная ветка/коммит → push → merge → следующая задача. Рабочий Git index пользователя не используется для staging; начальный index чистый. `git add` не выполняется.

| Задача | Результат | Статус |
| --- | --- | --- |
| 01-foundation | Ревизия, архитектура, источник контента, этапы и критерии | Завершена |
| 02-site | Nuxt, текущий MagicPath, адаптивность, локализация, реальные контакты | Завершена |
| 03-content-and-cms | CMS, схема, кейсы/статьи из Obsidian, картинки, редакционный workflow | Завершена; первый PAT-вход выполняет владелец |
| 04-quality-and-seo | SEO/RSS/sitemap, пагинация, unit/e2e/axe, review и исправления | Завершена |
| 05-release-and-deploy | GitHub CI/Release, публичный Sites, DNS и проверка production | CI и public snapshot проверены; Vercel Git integration блокируется доступом |
| 06-editable-pages | Редактирование страниц/карьеры, canonical publication, YAML и dependency fixes | Завершена, PR №6 влит, Release 1.0.1 подтверждён |
| 07-launch-audit | Patch Release, публикация точной CI-сборки, production verification и handoff | Public 1.0.1 проверен; automatic hosting integration требует доступа |
| 08-github-deployment | Vercel Hobby Git integration, versioned release and guest production verification | Automatic production deployment and Release 1.0.2 verified; admin entry header correction included |
| 09-manual-qa | Guided manual testing, focus/typing/filter/contents fixes | Local review and all 50 browser checks passed; merge publishes patch 1.0.4 |
| 10-english-repository | English documentation and repository-facing materials | Next, after manual QA is merged |
| 11-design-fidelity | Actual MagicPath mobile/tablet/browser layout, UI dimensions and spacing | Queued after English documentation |

Предыдущие планы и HTML-прототип удалены по поручению начать проект заново. Полезные изображения используются как исходные материалы; факты проверяются непосредственно по текущим заметкам Obsidian. После замечания пользователя удалён и оставшийся старый inventory.
