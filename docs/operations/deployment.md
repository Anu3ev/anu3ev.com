# Публикация, релизы и домен

Рабочий публичный адрес: **https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site**. Админка: [/admin/](https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site/admin/).

## Что автоматизировано

На PR и push в `master` GitHub Actions устанавливает зависимости по lockfile и проверяет схему контента, ESLint, TypeScript, unit, статическую генерацию, browser/axe и пагинацию. В browser suite один worker. Отчёты и проверенный архив хранятся в Actions три дня.

Когда `package.json.version` увеличивается, после успешных проверок создаются `vX.Y.Z`, GitHub Release и архив `anu3ev-portfolio-vX.Y.Z.tar.gz`. Обычные изменения контента с той же версией не создают новый Release. Тег не переносится на другой commit. Повторный run той же версии/commit допустим. У сайта нет npm-пакета.

Релиз: измените `package.json.version` на возрастающую стабильную `major.minor.patch`, откройте PR, дождитесь зелёного quality job и влейте в `master`. Прямые изменения `master` также проверяются, но branch protection не настроен: connector не имеет Administration permission. Не считайте проверки техническим запретом на merge.

## Что пока требует доступа владельца

**GitHub Release сейчас не обновляет Sites автоматически.** Sites — опубликованный резервный snapshot. CMS сохраняет Markdown и профиль в GitHub; появление этих изменений на этом адресе требует новой публикации. Это оставшаяся часть задачи, а не готовая CI/CD-интеграция.

Для штатного GitHub → hosting выбран существующий бесплатный Vercel Hobby. API подключения возвращает `403` при создании проекта, собственных credentials CLI нет. В Chrome открыт вход. Имеющаяся Google-сессия проверена: она не привязана к существующему Vercel user; дубликат аккаунта не создавался.

После входа в **существующий** Vercel account:

1. Import Git Repository → `Anu3ev/anu3ev.com`; разрешите GitHub App доступ только к этому репозиторию, если он не виден.
2. Выберите существующий Hobby workspace. Не включайте Pro trial, paid storage или integrations.
3. Node.js **24.x**. `vercel.json` уже задаёт `pnpm install --frozen-lockfile`, `pnpm check && pnpm build`, `.output/public`, static clean URLs и headers.
4. Установите публичную build-time переменную `NUXT_PUBLIC_SITE_URL` в фактический постоянный HTTPS-адрес нового проекта. Выполните production deployment из `master`.
5. Проверьте публичный вход без Vercel login, `/ru`, кейс, `/admin/`, `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/version.json` и неизвестный URL с HTTP 404. У private previews защита может оставаться включённой.

Git integration затем публикует каждый push `master`, включая CMS edits; релизная версия и deploy относятся к одному commit. Проверки Vercel build включают content/lint/types/unit. Browser/axe выполняются в GitHub; перед merge нужно дождаться их завершения. Этот порядок не заявляется как уже активный.

## Sites: воспроизводимая резервная публикация

Identity хранится в `.openai/hosting.json`; новый Site повторно не создаётся. Нужны инструменты Sites и короткоживущий source credential для этого ID. Сначала выполняются `pnpm check`, `pnpm build`, browser checks; исходники коммитятся и пушатся в GitHub. Та же ревизия отправляется на source remote Sites, её remote HEAD сверяется. Штатный `package-site.mjs` создаёт архив `.output/public` + manifest, `save_site_version` сохраняет его с точным commit SHA, `deploy_site_version` публикует сохранённую версию.

У source helper есть `git add --all`, поэтому в этой задаче вместо его staging использован отдельный Git index и обычный Git push; [обоснование](../tasks/05-release-and-deploy/hosting.md). Token передаётся через скрытый stdin и environment, не сохраняется в workflow. Публичный audience установлен по прямому поручению пользователя. Для сохранения ancestry GitHub PR с этой публикацией вливается merge commit, а не squash.

Для переноса на другой статический хост достаточно contents архива. Пути ожидают root deployment; GitHub Pages project subpath потребует отдельной настройки base URL или собственного домена.

## anu3ev.com

Домен пока не подключён. Фактический DNS: A `45.147.197.150`, nameservers Zomro. Доступа для правки DNS нет. Действующий HTTPS-адрес выше работает независимо от домена.

После выбора постоянного хостинга добавьте домен в его dashboard и внесите **выданные этим проектом** DNS records у текущего DNS-провайдера. Сначала дождитесь проверки ownership и HTTPS. Затем измените `NUXT_PUBLIC_SITE_URL=https://anu3ev.com` и пересоберите сайт. Canonical, alternate, sitemap, RSS, OG и JSON-LD берут origin из одного `getSiteOrigin()`; он отклоняет HTTP, credentials, query, hash и base path. Redirect старого host на основной включается после проверки нового.

Не используйте IP/CNAME другого хостинга из старой документации. `version.json` показывает версию; CI-сборка также включает commit SHA. При локальном build без CI commit равен `null`.
