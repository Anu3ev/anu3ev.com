/** A visible navigation ancestor for structured breadcrumbs. Paths are absolute within the current locale. */
export interface SeoAncestor {
  name: string
  url: string
}

/** Directory exports resolve directly with a trailing slash; canonical URLs must not point at a redirect. */
export function canonicalPagePath(path: string) {
  if (!path.startsWith('/') || path.includes('\\')) throw new Error('A page path must be absolute within the site')
  if (/[?#]/.test(path)) throw new Error('Pass query and fragment separately from the page path')
  return `${path.replace(/\/+/g, '/').replace(/\/$/, '')}/`
}

/** Adds breadcrumbs to the page's own graphs, preserving the real home/section/current destinations. */
export function createPageSchemas({ home, current, parent, graphs = [] }: { home: SeoAncestor, current: SeoAncestor, parent?: SeoAncestor, graphs?: readonly Record<string, unknown>[] }) {
  if (current.url === home.url) return graphs

  const items = [home, ...(parent ? [parent] : []), current]
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({ '@type': 'ListItem', 'position': index + 1, 'name': item.name, 'item': item.url }))
  }

  return [...graphs, breadcrumbs]
}

/** Prevents content-controlled strings from closing an inline JSON-LD script element. */
export function serializeJsonLd(graphs: readonly Record<string, unknown>[]) {
  return JSON.stringify(graphs).replace(/</g, '\\u003c')
}

/** Social crawlers need a raster alternative for the site's lightweight SVG article diagrams. */
export function socialImagePath({ locale, slug }: { locale: 'en' | 'ru', slug: string }) {
  return `/images/social/${locale}/${slug}.png`
}
