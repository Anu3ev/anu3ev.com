/** Metadata for one indexable page. Reactive values follow Nuxt's reused route components. */
interface PageSeo {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string>
  type?: 'website' | 'article'
  schema?: MaybeRefOrGetter<Record<string, unknown>[]>
  publishedTime?: MaybeRefOrGetter<string | undefined>
  noindex?: MaybeRefOrGetter<boolean>
}

/** Owns canonical, alternate languages, social cards and safely serialized structured data. */
export function usePageSeo(options: PageSeo) {
  const route = useRoute()
  const { locale } = useLocale()
  const { siteUrl } = useRuntimeConfig().public
  const origin = siteUrl.replace(/\/$/, '')
  const canonical = computed(() => `${origin}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`)
  const englishPath = computed(() => route.path.replace(/^\/ru(?=\/|$)/, '') || '/')
  const title = computed(() => `${toValue(options.title)} · Alexander Anufriev`)
  const image = computed(() => new URL(toValue(options.image) || '/images/og-default.png', origin).href)

  useSeoMeta({
    title: () => title.value,
    description: () => toValue(options.description),
    ogTitle: () => title.value,
    ogDescription: () => toValue(options.description),
    ogType: options.type || 'website',
    ogUrl: () => canonical.value,
    ogImage: () => image.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => toValue(options.title),
    ogLocale: () => locale.value === 'ru' ? 'ru_RU' : 'en_US',
    ogSiteName: 'Alexander Anufriev',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => toValue(options.description),
    twitterImage: () => image.value,
    articlePublishedTime: () => toValue(options.publishedTime),
    robots: () => toValue(options.noindex) ? 'noindex, follow' : 'index, follow'
  })

  useHead(() => ({
    htmlAttrs: { lang: locale.value },
    link: [
      { rel: 'canonical', href: canonical.value },
      { rel: 'alternate', hreflang: 'en', href: `${origin}${englishPath.value}` },
      { rel: 'alternate', hreflang: 'ru', href: `${origin}/ru${englishPath.value === '/' ? '' : englishPath.value}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${origin}${englishPath.value}` },
      { rel: 'alternate', type: 'application/rss+xml', title: 'Alexander Anufriev — Blog', href: `${origin}/rss.xml` }
    ],
    script: options.schema
      ? [{
          key: 'page-schema',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(toValue(options.schema)).replace(/</g, '\\u003c')
        }]
      : []
  }))
}
