# 07 — опубликован и проверен релиз 1.0.1

**Сайт:** https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/ · **Админка:** https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/admin/

Опубликован [Release v1.0.1](https://github.com/Anu3ev/anu3ev.com/releases/tag/v1.0.1), commit `6541daa29fb14356337f354cb4e75751d19afc3f`. [GitHub master run](https://github.com/Anu3ev/anu3ev.com/actions/runs/39355732251) прошёл 43 unit и 49 browser tests и создал архив. На Sites отправлен **ровно этот CI export**, с проверкой GitHub ZIP/Release SHA256 и всех 367 file hashes. Новый build после тестов не выполнялся. Source HEAD проверен; Sites saved version 3 опубликована успешно.

| Проверка | Фактический результат |
| --- | --- |
| Public guest access | Chrome и Playwright API 200, login не требуется, version/commit совпали |
| Production browser/axe | 49 pass, 0 skipped/flaky, 1 worker |
| Canonical/sitemap | все 28 HTML URLs отвечают 200 без redirect |
| Unit / v8 | 43 pass, 100% в 12 выбранных чистых модулях; не весь UI |
| Fallow core | dead code, cycles, boundaries, complexity, clones — 0 |
| Public mobile Lighthouse | 92 / 100 / 81 / 100; LCP 2.4 s, CLS 0, TBT 40 ms |
| Visual | desktop и RU mobile просмотрены; overflow на 375 px отсутствует |

[Проверки и ограничения](review.md), [provenance](reports/provenance.json), [browser report](reports/production-browser.json), [Lighthouse](reports/lighthouse-mobile.json), [dependency review](../06-editable-pages/dependencies.md).

**Что требует продолжения:** automatic GitHub → hosting deployment не активирован из-за Vercel 403/отсутствия рабочей авторизации. Сейчас новый контент сохраняется CMS в GitHub, а public Sites обновляется отдельной публикацией. В Chrome открыт вход для существующего Vercel account; [точные шаги](../../operations/deployment.md). Домен anu3ev.com не подключён: DNS-доступ отсутствует; текущий HTTPS-адрес работает независимо от него.

Первый PAT-вход/write CMS выполняет владелец по [инструкции](../../operations/content.md). Повтор успешного publish job не исполнялся после auto-review rejection; tag/asset проверены read-only. Полевых Core Web Vitals/INP и независимого code review пока нет. Непатченные tooling advisory не скрыты. Полностью завершённым весь исходный goal не считается.
