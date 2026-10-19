# 03 — контент и админка

Созданы пять полноценных кейсов и три статьи на английском и русском. Источники и границы утверждений — в [sources.md](sources.md). Коммерческий Vue-редактор отделён от open-source библиотеки; реальные demo/repo ссылки есть только там, где они существуют.

Подключена self-hosted Sveltia CMS 0.248.1: проекты, статьи, media и настройки профиля, native paired translations, editorial PR workflow и token login GitHub. [Инструкция владельцу](../../operations/content.md). Полноценная OAuth-инфраструктура не требуется этому варианту входа; её кнопка выключена.

Единые Zod-схемы проверяют content inputs; draft/future исключаются перед созданием публичной базы. Добавлены проверяемые ограничения Markdown, локальные изображения, парность переводов и календарь Asia/Tbilisi. Preview корректно отдаёт custom 404 с HTTP 404.

Проверки:

- `pnpm check:content`: pass, 10 project translations, 6 article translations, 1 excluded draft.
- `pnpm lint`: pass, 0 warnings.
- `pnpm test`: pass, **17 tests**. V8 coverage — 100% lines/branches/functions только в четырёх критичных файлах: pagination, publication date, content schemas, content inventory. Это не покрытие всего UI.
- `pnpm typecheck` и `pnpm build`: pass на финальной версии, без compiler diagnostics; 61 prerender entry.
- Browser: 3 статьи → поиск «undo» → 1 результат → полный Markdown article: pass. Draft URL возвращает реальную страницу 404 и HTTP 404. Сообщение браузера о ресурсе 404 ожидаемо для этого запроса, а не скрытая runtime-ошибка.
- CMS login/configuration/assets: pass, 0 configuration warnings/errors. Запись через личный PAT владельца **не запускалась**.
- SQLite/read-only SQL inspection: 6 published article rows, 10 project rows, 0 draft rows. Marker/slug draft-example отсутствуют в SQL export и `.output/public`.
- Fallow с фактическим `coverage-final.json`: **pass**, 0 complexity/unused files/exports/cycles/boundary violations/duplicates; остаётся один inherited devDependency notice для axe, используемого на этапе 04. Попытка передать lcov была отклонена Fallow как unsupported input; она не считалась успешным audit.

Проведены самопроверка, исправления и повторный проход. Независимое ревью не проводилось. CI/release и публичный deployment остаются этапом 05.
