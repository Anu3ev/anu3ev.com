# Публикация и границы доступа

Vercel Git import в существующий Hobby team получил `403 forbidden: You don't have permission to create the project`. Локальных Vercel CLI credentials нет. В браузере открыт вход; интерактивная авторизация владельца ещё не выполнена. Это отказ внешнего API, не ошибка Nuxt build. Ранее автоматический review запросил доказательство разрешённого состава; после read-only проверки действие было допущено до API.

Резервная публикация: Sites, проект `appgprj_6ad6aec278ec8191a1a7e24b47e9ec53`, ожидаемый URL `https://anu3ev-portfolio.pastel-glade-2427.chatgpt.site`. Пользователь прямо запросил доступ из интернета, поэтому audience задан `public`; репозиторий GitHub остаётся private. Плагины, storage, платные ресурсы и runtime secrets не подключаются.

Стандартный Sites `site-workflow.mjs` вызывает `git add --all` в `saveSource()`. Это конфликтует с прямым пользовательским запретом `git add`, который имеет приоритет над скиллом. Поэтому исходники коммитятся через отдельный Git index; та же зафиксированная ревизия отправляется штатным Git transport с временным source credential через stdin/environment. Токен не пишется в файл, shell arguments, Git config или документацию. Архив создаётся штатным `package-site.mjs` из неизменённой сборки этой ревизии. Непроверенный push или несовпадение remote HEAD блокируют сохранение.

Sites публикует вручную сохранённые версии через native tools. Это даёт доступный резервный snapshot, но **не заменяет GitHub → hosting integration**. Автоматическое обновление публичного Sites после GitHub Release пока не настроено: short-lived credentials не сохраняются в workflow. Готовый `vercel.json` позволяет закончить Git integration после предоставления рабочей авторизации, без смены стека или контента.

DNS: фактически 20 октября 2026 `anu3ev.com` имеет A `45.147.197.150`, NS `ns1.zomro.net`, `ns2.zomro.ru`, `ns3.zomro.com`, `ns4.zomro.su`. Без доступа к DNS-регистратору записи не меняются; canonical использует доступный host, не будущий домен.
