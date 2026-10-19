# Review: CI и релизы

Требования: бесплатные GitHub checks, версия → Release с проверенной сборкой, один browser worker, отсутствие credential leakage, отдельная задача и проверяемый результат.

Первый проход обнаружил, что `gh api ... || true` скрывает не только отсутствие тега, но и отказ авторизации/сети. Заменено на успешный запрос matching refs; ошибки API теперь останавливают job. Существующий тег разрешается до commit через `/commits/:ref`, поэтому корректно обрабатывается и annotated tag. Перемещение версии на другой commit запрещено. Повторная публикация того же commit идемпотентна.

Проверены fork/PR permissions, точный artifact name между jobs, `fetch-depth` для сравнения с родителем, сохранение отчётов при падении и short retention. Нет `pull_request_target`, custom PAT, печати токенов или npm publishing. `persist-credentials: false`; токен Release доступен только job с Contents write.

`pnpm check`: pass, 31 unit tests, полное покрытие 10 выделенных чистых модулей. Release tests покрывают равную версию, patch/minor/major, numeric ordering, downgrade, prerelease, invalid previous version и multiline output injection. Official actionlint 1.7.12 (SHA256 проверен) — pass. Fallow 3.34.1: 0 dead code, cycles, boundaries, complexity findings и clones.

Второй проход сопоставил YAML с официальными action.yml и commit refs; pnpm annotated v4 tag разрешён до commit SHA. Настоящий GitHub run проверяется до merge. Существующие ограничения CSS/conditional skip из этапа 04 не маскируются. Самопроверка не является независимым review.
