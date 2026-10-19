# 04 — качество, SEO и performance

Готова статическая SEO-инфраструктура: 28 канонических страниц, sitemap, robots, EN/RU RSS, hreflang/x-default, Open Graph/Twitter, растровые social images 1200×630, Person/WebSite, BlogPosting, CreativeWork и BreadcrumbList. Даты, canonical и JSON-LD согласованы. Неверные URL и draft возвращают HTTP 404.

Добавлены browser/axe проверки, SSR без JavaScript и отдельная настоящая Nuxt SSG-сборка с 12 статьями на язык. Ни синтетические статьи, ни test fixture не публикуются. Политика page size и route generation общая для HTML и sitemap.

По результатам замеров исправлены blocking theme request, font preload hydration duplication, responsive covers, image size, лишняя предзагрузка destination routes и contrast CTA на телефоне. Все страницы используют палитру текущего Home/Blog. [Снимки](home-desktop.webp), [Blog](blog-desktop.webp), [RU mobile](home-ru-mobile.webp).

## Проверено

| Проверка | Результат и охват |
| --- | --- |
| ESLint / Nuxt typecheck / SSG | pass, без compiler warnings/diagnostics |
| Unit / v8 | 27 tests pass; 100% lines/branches/functions в 9 критичных чистых модулях; не всё приложение |
| Полный browser suite | 46 pass, 0 skipped, Chromium, 1 worker |
| После финального font-hydration исправления | 5 targeted tests pass, включая новый regression test; всего определено 47 e2e tests |
| Desktop Lighthouse | 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 0.5 s, CLS 0, TBT 0 ms |
| Mobile Lighthouse | после оптимизации 98 / 100 / 100 / 100; LCP 2.2 s, CLS 0, TBT 20 ms; точный финальный замер — в JSON report |
| Font hydration | 2 RU preloads, 2 реальных font requests, browser console errors/warnings 0 |
| Fallow | `warn`: 0 dead code, unused imports/exports, cycles, boundary violations, function complexity и duplication; CSS/risk heuristics разобраны в review |

Первый полный browser run упал на реальных проблемах accessibility/canonical и двух неверных предпосылках test locators; исправления проверены сначала на 5 представительных сценариях, затем на полном наборе. Первоначальный mobile Lighthouse был 86/96/100/100. История исправлений не выдаётся за изначальный pass.

[Review](review.md) описывает найденное, исправленное и обоснованно сохранённые предупреждения. [Отчёты](reports/lighthouse-summary.json) сохраняют фактические цифры. Новые статьи не датированы задним числом; актуальное резюме подтверждает конец frontend-периода inSales в сентябре 2026.

Core Web Vitals здесь измерены **лабораторно**. Полевые INP/CrUX требуют реальных посещений. Автоматические axe/Lighthouse не означают полной ручной WCAG-сертификации. Первый PAT login/write CMS остаётся действием владельца. Независимое ревью не проводилось.
