# 06 — контент страниц управляется из CMS

Теперь через админку редактируются не только кейсы, статьи и краткий профиль, но и Home, About, карьера, инструменты, подход, вступления Portfolio/Blog, Contacts, правая колонка, CTA и Privacy. Имя на двух языках, фото, авторские подписи и метаданные используют профиль. [Инструкция](../../operations/content.md).

В `content/settings/pages.json` — проверенные EN/RU данные, в i18n — короткие UI labels. Месяцы карьеры проверяются до сборки, окончание можно оставить пустым для текущей работы. Фото должно существовать внутри public images. Удалены дублирующая Content collection и неиспользуемые labels.

Публичная проверка выявила redirect в canonical URLs: политика пути теперь соответствует реальному host, с `/` в конце страниц. Sitemap/RSS/OG/schema/navigation согласованы; проверяется HTTP 200 без redirect. Frontmatter использует YAML 1.2, принимает обычные date strings/BOM/CRLF и отклоняет executable engines до разбора. Обновлены исправляемые Sharp/compression advisory; оставшиеся 2 high + 1 moderate в build tooling разобраны [отдельно](dependencies.md).

Проверено: lint, types, SSG, **43 unit tests**, полный local browser suite **49 pass**, затем два targeted tests финального поля Privacy; 100% coverage в 12 выбранных чистых модулях, Fallow core findings 0. [Review](review.md) описывает исправления и границы проверки. CI перед merge повторяет полный набор. Patch version — **1.0.1**; фактический Release/publication после merge фиксируется в launch audit.

Первый PAT-вход/write CMS выполняет владелец. Отказ Vercel 403 и отсутствие DNS-доступа не обойдены: автоматическая GitHub → hosting integration ещё требует рабочей авторизации. Опубликованный Sites обновляется отдельной операцией.
