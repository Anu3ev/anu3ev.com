import { canonicalPagePath } from '../../shared/seo'

/** These are the only link relations emitted by this site's page metadata. */
interface PageHeadLink {
  rel: 'canonical' | 'alternate'
  href: string
  hreflang?: 'en' | 'ru' | 'x-default'
  type?: 'application/rss+xml'
  title?: string
}

/** Produces canonical, locale alternatives and the feed link as one consistent head contract. */
export function createPageLinks({ origin, path, locale, feedTitle }: { origin: string, path: string, locale: 'en' | 'ru', feedTitle: string }) {
  const canonicalPath = canonicalPagePath(path)
  const englishPath = canonicalPath.replace(/^\/ru(?=\/|$)/, '')
  const canonical = `${origin}${canonicalPath}`

  const links = [
    { rel: 'canonical', href: canonical },
    { rel: 'alternate', hreflang: 'en', href: `${origin}${englishPath}` },
    { rel: 'alternate', hreflang: 'ru', href: `${origin}/ru${englishPath}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${origin}${englishPath}` },
    { rel: 'alternate', type: 'application/rss+xml', title: feedTitle, href: `${origin}${locale === 'ru' ? '/ru' : ''}/rss.xml` }
  ] satisfies PageHeadLink[]

  return { canonical, links }
}
