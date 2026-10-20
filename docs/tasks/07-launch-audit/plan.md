# 07 — проверка опубликованного релиза

Исходник публикации — master commit `6541daa29fb14356337f354cb4e75751d19afc3f`, Release `v1.0.1`. Публикуем уже протестированный CI export, не пересобираем другой binary после проверок. ZIP проверяется по GitHub artifact SHA256, внутренний tar.gz — по digest Release asset, `version.json` — по версии/commit. Перед извлечением проверяются paths и отсутствие symlinks.

Sites source remote должен иметь тот же commit. Штатный packager добавляет только hosting manifest; hashes всех публичных файлов сравниваются с CI export. Затем сохраняется и публикуется версия того же существующего Site с public audience. Credentials и signed references остаются в памяти и передаются через скрытый stdin.

После публикации: чистая guest browser session, полный production browser/axe suite, прямые canonical/sitemap URLs без redirect, version endpoint, CMS configuration, mobile Lighthouse и визуальный просмотр. Отдельно фиксируются доступные проверки Release и ограничения внешних аккаунтов. Последние отчёты и summary коммитятся/пушатся/мержатся отдельной задачей.
