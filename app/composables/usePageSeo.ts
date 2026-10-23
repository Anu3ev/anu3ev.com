import { createPageLinks } from '~/utils/seo'
import { createPageSchemas, serializeJsonLd, type SeoAncestor } from '~~/shared/seo'
import profile from '~~/content/settings/profile.json'

/** Reactive metadata follows the current route when Nuxt reuses a page component. */
interface PageSeo {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string>
  type?: 'website' | 'article'
  schema?: MaybeRefOrGetter<Record<string, unknown>[]>
  parent?: MaybeRefOrGetter<SeoAncestor | undefined>
  publishedTime?: MaybeRefOrGetter<string | undefined>
  noindex?: MaybeRefOrGetter<boolean>
  /** Cases and articles publish a Markdown copy beside the page (`…/index.md`) for AI tools; the head points to it. */
  markdownCopy?: MaybeRefOrGetter<boolean>
}

/** Owns canonical, alternate languages, social cards and escaped page/breadcrumb structured data. */
export function usePageSeo(options: PageSeo) {
  const route = useRoute()
  const { locale, copy, localePath } = useLocale()
  const siteContent = useSiteContent()
  const origin = useSiteOrigin()
  const ownerName = computed(() => locale.value === 'ru' ? profile.name_ru : profile.name)
  const pageLinks = computed(() => createPageLinks({ origin, path: route.path, locale: locale.value, feedTitle: `${ownerName.value} — ${siteContent.value.blog.title}` }))
  const title = computed(() => `${toValue(options.title)} · ${ownerName.value}`)
  const image = computed(() => new URL(toValue(options.image) || '/images/og-default.png', origin).href)
  const graphs = computed(() => createPageSchemas({
    home: { name: copy.value.home, url: `${origin}${localePath('/')}` },
    current: { name: toValue(options.title), url: pageLinks.value.canonical },
    parent: toValue(options.parent),
    graphs: toValue(options.schema)
  }))

  useSeoMeta({
    title: () => title.value,
    description: () => toValue(options.description),
    ogTitle: () => title.value,
    ogDescription: () => toValue(options.description),
    ogType: options.type || 'website',
    ogUrl: () => pageLinks.value.canonical,
    ogImage: () => image.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => toValue(options.title),
    ogLocale: () => locale.value === 'ru' ? 'ru_RU' : 'en_US',
    ogSiteName: () => ownerName.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => toValue(options.description),
    twitterImage: () => image.value,
    articlePublishedTime: () => toValue(options.publishedTime),
    robots: () => toValue(options.noindex) ? 'noindex, follow' : 'index, follow'
  })

  useHead(() => ({
    htmlAttrs: { lang: locale.value },
    link: toValue(options.markdownCopy)
      ? [...pageLinks.value.links, { rel: 'alternate', type: 'text/markdown', href: `${pageLinks.value.canonical}index.md` }]
      : pageLinks.value.links,
    script: [{ key: 'page-schema', type: 'application/ld+json', innerHTML: serializeJsonLd(graphs.value) }]
  }))
}
