# 05 — GitHub CI и versioned release

Сначала проверяем pipeline в отдельном PR, затем делаем первый production release при фактической публикации. Существующий `image-editor` прочитан как аналог: смена `package.json.version` запускает тег и Release. Пакет сайта в npm не публикуется.

CI проверяет content schema, ESLint, Nuxt types, unit, SSG, Chromium/axe и настоящую пагинацию; browser workers — 1. Release job получает ровно проверенный архив, а не пересобирает исходники. Внешние actions закреплены commit SHA официальных репозиториев, Node — из `.node-version`, pnpm — из `packageManager`. По умолчанию права read-only; только release job получает Contents write.

Статус hosting: API Vercel после проверки допустимости передачи нового публичного портфолио вернул 403 на создание проекта в существующем Hobby team. CLI и его собственные credentials отсутствуют. GitHub Pages пока не включён; официальный configure-pages требует administration permission при первом включении, которого нет у GitHub connector. Visibility приватного репозитория не меняется. Нужен доступ к поддерживаемому хостингу; отдельная задача публикации фиксирует реальный результат и выбранный fallback.

Контроль перед публикацией: 131 tracked file, нет `.env` кроме публичного `.env.example`, private-key files, token markers, исходников других проектов и хранилища Obsidian. Статический export не содержит symlinks. Эти проверки не выдаются за полноценный secret scanner или независимый security audit.
