# 05 — CI, релизы и публичный сайт

Сайт доступен без входа: **https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site**. [Админка](https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/admin/), [редактирование](../../operations/content.md), [публикация и домен](../../operations/deployment.md).

GitHub Actions проверяет PR/master: content schema, ESLint, Nuxt types, unit, SSG, Chromium/axe и настоящую пагинацию. При повышении версии отдельный job с минимальными правами публикует immutable semver tag, Release и тот же проверенный архив. Официальные actions закреплены SHA; Node 24 и pnpm фиксированы; отчёты сохраняются три дня. Версия подготовлена к `1.0.0`; первый Release должен быть подтверждён **после merge**, не объявляется уже существующим.

Sites identity сохранён в `.openai/hosting.json`, source HEAD проверен, две версии сохранены и опубликованы штатными инструментами. Исходники GitHub остаются private. Token передавался через скрытый stdin/environment; `git add` не выполнялся. Штатный Sites staging заменён из-за прямого запрета пользователя. [Решение](hosting.md).

Production выявил гонку поиска/истории и пустой native input при прямом query URL. URL стал единственным владельцем фильтров; начальные параметры применяются после гидрации. Добавлен regression reload/noindex/hydration. Privacy обновлена под фактический хостинг и его технические cookies.

## Проверено

- `pnpm check` и production SSG: pass, 34 unit tests; 100% покрытия в 11 выделенных чистых модулях, не во всём приложении.
- [GitHub run исправленной ревизии](https://github.com/Anu3ev/anu3ev.com/actions/runs/39346726243): 34 unit и 48 browser tests pass.
- Публичная исправленная версия: **48 browser tests pass, 0 skipped**, один worker. Включены оба языка/темы, mobile, HTML без JavaScript, CMS login, все sitemap URLs, настоящий HTTP 404, direct search reload и пагинация.
- Official actionlint 1.7.12: pass. Fallow: 0 dead code, cycles, boundaries, complexity findings и clones; существующие CSS/conditional skip heuristics рассмотрены отдельно.
- Public mobile Lighthouse: **93 Performance / 100 Accessibility / 81 Best Practices / 100 SEO**, LCP **2.4 s**, CLS **0.004**, TBT **30 ms**. Best Practices снижен deprecated APIs в добавляемом хостингом Cloudflare challenge script, отсутствующем в исходниках приложения. Локальные замеры этапа 04 не выдаются за production.

Первая production-проверка: 46 pass / 1 fail; причина исправлена, затем выполнен полный повторный проход. [Первый run](reports/first-production-browser-run.json), [Lighthouse](reports/lighthouse-production.json), [review](review.md). Все Core Web Vitals здесь лабораторные; полевых INP/CrUX ещё нет.

## Что не завершено

**Автоматическая GitHub → hosting публикация блокируется доступом Vercel (403).** Sites обновлён вручную; CMS сохраняет контент в GitHub, но сама по себе пока не обновляет этот публичный snapshot. Готовы `vercel.json` и точная инструкция завершения подключения. Имеющийся Google account не связан с существующим Vercel user; новый дублирующий аккаунт не создавался.

`anu3ev.com` пока остаётся на прежнем DNS Zomro; доступа к правке нет. Первый PAT-вход в CMS выполняет владелец. Независимое code review не проводилось; выполнены самопроверка, исправления и повторные проверки. Эти ограничения не позволяют объявить весь исходный goal полностью завершённым.
