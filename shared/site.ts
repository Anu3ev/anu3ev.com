/** Stable production origin shared by local builds and GitHub release artifacts. */
export const DEFAULT_SITE_ORIGIN = 'https://anu3ev.com'

/** A static site's canonical origin must agree in HTML, feeds, sitemap and social cards. */
export function getSiteOrigin(value = DEFAULT_SITE_ORIGIN) {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error('The public canonical origin must use HTTPS')
  if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('The public site URL must be an origin without credentials, path, query or fragment')
  }

  return url.origin
}

/** The site's own source code; the footer links to it. */
export const SOURCE_REPOSITORY = 'https://github.com/Anu3ev/anu3ev.com'
