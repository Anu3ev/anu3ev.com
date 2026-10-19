# 02 — Nuxt и макет MagicPath

Создано новое приложение Nuxt 4.6.2, Vue 3.5.44, Vue Router 5.4.0, TypeScript и Tailwind 4. Используется Node 24.15 LTS, локальный Inter и статическая генерация.

После авторизации пользователя прочитаны все четыре экрана текущего MagicPath. Реализованы левое меню, центральная лента, правый профиль, Home cover, закреплённая заметка, список проектов, блог, Contacts. Portfolio/Contacts используют синюю палитру Home/Blog. [Снимки и ревизии](../../reference/magicpath/README.md).

Дополнительно работают страницы кейса/статьи, About, Privacy и 404, русский язык, светлая тема, сохранение темы, native mobile disclosure с Escape/focus и закрытием после навигации. Реальные ссылки используются вместо прототипных navigation buttons. В портфолио работают фильтры. Начальный полный кейс редактора изображений написан по текущей заметке Obsidian.

По замечанию пользователя удалён и оставшийся прежний inventory. Старые планы, HTML-прототип, Figma и прежняя палитра не являются требованиями нового приложения. Новая документация относится к текущему заданию.

## Проверки

- `pnpm lint`: pass, 0 warnings.
- `pnpm typecheck`: pass, без diagnostics.
- `pnpm test`: pass, 8 тестов пагинации: 0/1/10/11/20/21 статей, отсутствие повторов, invalid page/pageSize.
- `pnpm build`: pass, 33 prerender entries вместе с payload/техническими страницами; compiler warnings отсутствуют.
- Реальный браузер: Home → Portfolio → Markdown-кейс → эквивалентный русский кейс → тема → контактный mailto: pass.
- Мобильный браузер: Enter открывает меню, переход закрывает его, RU сохраняет раздел, 320 px без overflow, прямой URL русского кейса открывает HTML: pass.
- Console errors/warnings в проверенном сценарии: 0.
- Fallow после исправлений: **warn**, 0 complexity/unused files/unused exports/cycles/boundary violations/duplicates, 4 devDependency notices для следующих задач. Они не скрыты; окончательный аудит следует после CMS и browser suite.

Установка имеет upstream notices о deprecated/peer зависимостях Nuxt Content/kit; это не называется «нулём предупреждений установки». Новые runtime/compiler diagnostics не подавлялись.

Выполнены два прохода самопроверки и исправления. Независимое ревью не проводилось. Наполнение и CMS — этап 03, полный SEO/axe/e2e — 04, CI/release/production — 05.
