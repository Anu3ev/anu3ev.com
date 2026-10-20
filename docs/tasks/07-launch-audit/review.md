# Review опубликованной версии

Требования сопоставлены с фактической публикацией, а не только local build. Источник — master/Release 1.0.1. GitHub ZIP digest, digest внутреннего Release tar, `version.json` и source remote HEAD совпали с ожидаемой ревизией. Все **367 public file hashes** после Sites packaging совпали с CI export; добавлен только обязательный hosting manifest. Paths и symlinks проверены до извлечения.

На чистом гостевом браузере сайт и version endpoint ответили 200 без login или owner bypass headers. Первоначальный Python urllib probe получил Cloudflare 403/1010; это подтверждённая browser-signature блокировка провайдера, а не private audience. Обычные Chrome и Playwright API request дали 200. Настройки защиты платформы не отключались. [Cloudflare 1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/), [Browser Integrity Check](https://developers.cloudflare.com/waf/tools/browser-integrity-check/).

Отдельный web-fetch инструмент не смог открыть этот адрес. Его результат не подменяется browser-проверкой и не доказывает недоступность для Google; фактическая поисковая индексация/Search Console не проверены. Подтверждены публичный браузерный доступ и техническая SEO-разметка.

Полный production suite: **49 passed, 0 skipped, 0 flaky**, один worker. Sitemap проверен по всем 28 URLs с `maxRedirects: 0`; metadata, локали, две темы, reflow, keyboard/menu/focus, SSR без JavaScript, поиск/Назад/reload, CMS configuration и дата Privacy согласованы. Отдельная локальная настоящая SSG fixture подтверждает 10 + 2 статьи, второй URL/reload, поиск и RU switch; fake articles не публиковались.

Desktop и RU mobile screenshots просмотрены: три колонки и палитра актуального Home/Blog сохранены, на 375 px горизонтального overflow нет. [Desktop](home-public-desktop.jpg), [mobile](home-public-ru-mobile.jpg).

Final mobile Lighthouse: 92 Performance, 100 Accessibility, 81 Best Practices, 100 SEO; LCP 2.4 s, CLS 0, TBT 40 ms. Единственный weighted Best Practices finding — deprecated APIs в Cloudflare challenge-platform script. Это не код приложения, не скрытое предупреждение и не причина объявлять score 100. Замер лабораторный; field INP/CrUX отсутствуют у нового сайта.

Повторный запуск уже успешного publish job был отклонён automatic approval review: он может повторно менять Release/assets и не имеет отдельного явного разрешения. Обходов или повторных запросов не было. Проверены read-only существующий tag SHA, uploaded state/size и SHA256 архива; это **не** выдаётся за фактический повторный запуск job. Первый production publish workflow завершился успешно и создал правильный Release.

Внешние ограничения пересмотрены: Vercel create-project по-прежнему не имеет рабочих прав (403), CLI credentials нет; имеющийся Google account не связан с существующим Vercel user, GitHub web session не авторизована. Новые дублирующие accounts не создавались, GitHub Pages не включался обходом Administration scope. DNS anu3ev.com остаётся у Zomro. Эти ограничения не решаются изменением Vue/CI-кода.

Исходный goal **не объявлен полностью завершённым**: public snapshot работает, CI/Release работают, но GitHub → hosting automatic update требует доступ владельца. Первый PAT write CMS не выполнялся. Остаточные tooling advisory и ограничения автоматического accessibility review сохранены в документации.
