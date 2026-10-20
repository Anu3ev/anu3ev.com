/** Resolve the complete native navigation attributes against a validated origin, retaining authored metadata and malformed-link behavior. */
export function getLinkNavigation({ href, siteUrl, target, rel }: {
  href?: string
  siteUrl: string
  target?: string
  rel?: string
}) {
  const linkTarget = (() => {
    if (!href) return target

    try {
      const destination = new URL(href, siteUrl)
      const isExternal = ['https:', 'http:'].includes(destination.protocol) && destination.origin !== siteUrl
      return isExternal ? '_blank' : target
    }
    catch {
      return target
    }
  })()

  return {
    target: linkTarget,
    rel: linkTarget === '_blank' ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel
  }
}
