# Review: редактирование и публикация

Требование проверено по пользовательскому сценарию: изменить профиль/страницу в CMS, сохранить корректные языковые варианты, получить согласованные HTML, изображения и метаданные после сборки. Длинные тексты не должны требовать правки Vue.

Граница теперь явная: `pages.json` и `profile.json` владеют редакционными данными, Zod проверяет их до SSG, `useSiteContent()` читает типизированные настройки, Vue отображает их. Структура виджетов English/Русский единая через YAML anchor. Contract test сверяет страницы, About и career fields с данными. Неиспользуемая profile/SQLite collection удалена; JSON валидируется publisher boundary. Удалены 70 перемещённых редакционных полей и 34 неиспользуемых label values из i18n.

Проверен весь граф профиля: Home, About/photo/alt, sidebar, header/footer, автор статьи, SEO title/OG, RSS и CreativeWork. Исправлены оставшиеся литералы имени и фото, форматы периода, редактируемая дата Privacy. Copyright year берётся из build runtime config: первый рендер не зависит от года на клиентских часах. Счётчик результатов использует нейтральную RU/EN форму.

Повторный проход обнаружил реальную проблему hosting: `/blog` отвечал 307 на `/blog/`, а canonical указывал redirect. Введён один `canonicalPagePath()`, согласованы навигация, alternate, sitemap, RSS, schema, CMS preview и Vercel trailingSlash. Sitemap e2e теперь проверяет **200 без follow redirects**. Fixture передаёт origin с `/`; JSON-LD проверяется на отсутствие двойного слеша. Восемь проверенных внутренних Markdown links обновлены.

Reader frontmatter согласован с YAML 1.2 и не допускает executable engine. Первая реализация увеличила Fallow cognitive score inventory до 18: формат/encoding/parser policy вынесены в содержательный `readEditorialSource`, обход файлов остался владельцем enumeration. Повторный Fallow: 0 dead code, cycles, boundaries, complexity и clones, без suppressions. Убран недостижимый fallback пути после введения canonical invariant.

В тестах исправлен реальный Node 24 integration issue: JSON imports Playwright требуют `with { type: 'json' }`; Vitest/Vite ранее скрывал это различие. Browser checks больше не привязаны к фиксированному редактируемому Blog title. Отдельный сценарий проверяет реальные CMS values, автора, фото, карьеру, Privacy и availability в обоих языках. Pagination fixture действительно собирает 12 статей с датами без кавычек и сохраняет поиск на второй странице/reload.

Проверки: `pnpm check` / SSG pass, **43 unit tests**, 100% lines/branches/functions в 12 критичных чистых модулях. Полный local browser run: **49 pass**, затем два targeted tests после последнего поля даты Privacy. Настоящий GitHub run повторяет полный набор перед merge. [Dependency review](dependencies.md) сохраняет реальные оставшиеся advisory; audit не объявляется зелёным. Независимого reviewer не было; выполнены самопроверка, исправления и повторный проход.
