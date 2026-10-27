import { BLOG_PAGE_SIZE } from '../../shared/blog'
import { canonicalPagePath } from '../../shared/seo'

/** Only the routing fields are needed from a validated content document. */
interface RoutableDocument {
  isPublic: boolean
  metadata: { locale: 'en' | 'ru', slug: string }
}

/** A recommendation has one file for both languages, so its slug comes from the filename rather than a locale field. */
interface RoutableRecommendation {
  isPublic: boolean
  slug: string
}

/** Includes every published route, even pagination pages that a link crawler could otherwise miss. */
export function createPublicPaths({ projects, posts, recommendations }: {
  projects: readonly RoutableDocument[]
  posts: readonly RoutableDocument[]
  recommendations: readonly RoutableRecommendation[]
}) {
  const paths: string[] = []
  const staticPages = ['/', '/work', '/blog', '/recommendations', '/about', '/contact', '/privacy']

  for (const locale of ['en', 'ru']) {
    const prefix = locale === 'ru' ? '/ru' : ''
    const localeProjects = projects.filter(project => project.isPublic && project.metadata.locale === locale)
    const localePosts = posts.filter(post => post.isPublic && post.metadata.locale === locale)
    paths.push(...staticPages.map(path => `${prefix}${path === '/' ? '' : path}` || '/'))
    paths.push(...localeProjects.map(project => `${prefix}/work/${project.metadata.slug}`))
    paths.push(...localePosts.map(post => `${prefix}/blog/${post.metadata.slug}`))
    paths.push(...recommendations.filter(recommendation => recommendation.isPublic).map(recommendation => `${prefix}/recommendations/${recommendation.slug}`))

    const additionalPages = Math.max(0, Math.ceil(localePosts.length / BLOG_PAGE_SIZE) - 1)
    paths.push(...Array.from({ length: additionalPages }, (_, index) => `${prefix}/blog/page/${index + 2}`))
  }

  return paths.map(canonicalPagePath).sort()
}
