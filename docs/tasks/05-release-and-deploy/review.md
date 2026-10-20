# Review: CI и релизы

Требования: бесплатные GitHub checks, версия → Release с проверенной сборкой, один browser worker, отсутствие credential leakage, отдельная задача и проверяемый результат.

Первый проход обнаружил, что `gh api ... || true` скрывает не только отсутствие тега, но и отказ авторизации/сети. Заменено на успешный запрос matching refs; ошибки API теперь останавливают job. Существующий тег разрешается до commit через `/commits/:ref`, поэтому корректно обрабатывается и annotated tag. Перемещение версии на другой commit запрещено. Повторная публикация того же commit идемпотентна.

Проверены fork/PR permissions, точный artifact name между jobs, `fetch-depth` для сравнения с родителем, сохранение отчётов при падении и short retention. Нет `pull_request_target`, custom PAT, печати токенов или npm publishing. `persist-credentials: false`; токен Release доступен только job с Contents write.

`pnpm check`: pass, 31 unit tests, полное покрытие 10 выделенных чистых модулей. Release tests покрывают равную версию, patch/minor/major, numeric ordering, downgrade, prerelease, invalid previous version и multiline output injection. Official actionlint 1.7.12 (SHA256 проверен) — pass. Fallow 3.34.1: 0 dead code, cycles, boundaries, complexity findings и clones.

Второй проход сопоставил YAML с официальными action.yml и commit refs; pnpm annotated v4 tag разрешён до commit SHA. Настоящий GitHub run проверяется до merge. Существующие ограничения CSS/conditional skip из этапа 04 не маскируются. Самопроверка не является независимым review.

Production-проход выявил ещё две связанные проблемы поиска, несмотря на зелёный local CI: результаты могли опережать query-string navigation, а при прямом статическом URL native input сохранял пустое SSR value. Удалены самостоятельные refs/watch для filters; URL владеет состоянием. Первый update на том же listing сохраняет фактический pathname с trailing slash. Отдельный hydration-ready flag обновляет и v-model, и результаты после статического HTML. Проверено сначала на трёх затронутых сценариях, затем **все 48 browser tests прошли на публичном сайте**, а также в настоящем GitHub run. Новые origin tests довели unit suite до 34 tests с 11 полностью покрытыми чистыми модулями.

Privacy теперь описывает реальный Sites/Cloudflare, включая технические bot-protection cookies. Lighthouse Best Practices 81 вызван deprecated API внешнего `/cdn-cgi/challenge-platform/scripts/jsd/main.js`; исходники приложения этих API не содержат. Скрипт защиты хостинга не отключался и предупреждения не скрывались. Источники: [Cloudflare JavaScript Detections](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/), [Cloudflare cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/).
