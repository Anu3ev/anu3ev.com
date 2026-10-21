import { describe, expect, it } from 'vitest'
import { createPageLinks } from '../../app/utils/seo'
import { createPublicPaths } from '../../scripts/lib/routes'
import { canonicalPagePath, createCredentialSchemas, createPageSchemas, serializeJsonLd, socialImagePath } from '../../shared/seo'

const origin = 'https://portfolio.example.test'

describe('canonical routes and structured data', () => {
  it.each([
    { locale: 'en', path: '/', canonical: '/', english: '/', russian: '/ru/', feed: '/rss.xml' },
    { locale: 'ru', path: '/ru/', canonical: '/ru/', english: '/', russian: '/ru/', feed: '/ru/rss.xml' },
    { locale: 'ru', path: '/ru/blog/note/', canonical: '/ru/blog/note/', english: '/blog/note/', russian: '/ru/blog/note/', feed: '/ru/rss.xml' },
    { locale: 'en', path: '/blog/page/2', canonical: '/blog/page/2/', english: '/blog/page/2/', russian: '/ru/blog/page/2/', feed: '/rss.xml' }
  ] as const)('keeps $path canonical and points language alternatives at the equivalent page', ({ locale, path, canonical, english, russian, feed }) => {
    const result = createPageLinks({ origin, path, locale, feedTitle: 'Editable author — Blog' })

    expect(result.canonical).toBe(`${origin}${canonical}`)
    expect(result.links.find(link => link.hreflang === 'en')?.href).toBe(`${origin}${english}`)
    expect(result.links.find(link => link.hreflang === 'ru')?.href).toBe(`${origin}${russian}`)
    expect(result.links.find(link => link.type === 'application/rss+xml')?.href).toBe(`${origin}${feed}`)
    expect(result.links.find(link => link.type === 'application/rss+xml')?.title).toBe('Editable author — Blog')
  })

  it('normalizes page directory paths and keeps non-path input out of canonical URLs', () => {
    expect(canonicalPagePath('/ru//blog///')).toBe('/ru/blog/')
    expect(() => canonicalPagePath('https://example.test')).toThrow('absolute within the site')
    expect(() => canonicalPagePath('/\\example.test')).toThrow('absolute within the site')
    expect(() => canonicalPagePath('/blog?q=Vue')).toThrow('query and fragment separately')
  })

  it('keeps the home graphs and adds a real parent chain to an internal article', () => {
    const home = { name: 'Home', url: `${origin}/` }
    const person = { '@type': 'Person', 'name': 'Alexander Anufriev' }
    expect(createPageSchemas({ home, current: home, graphs: [person] })).toEqual([person])

    const article = { '@type': 'BlogPosting', 'headline': 'Editor lifecycle' }
    const graphs = createPageSchemas({
      home, parent: { name: 'Blog', url: `${origin}/blog` },
      current: { name: 'Editor lifecycle', url: `${origin}/blog/editor-lifecycle` }, graphs: [article]
    })
    expect(graphs[0]).toEqual(article)
    expect(graphs[1]).toMatchObject({ '@type': 'BreadcrumbList', 'itemListElement': [
      { position: 1, name: 'Home', item: `${origin}/` },
      { position: 2, name: 'Blog', item: `${origin}/blog` },
      { position: 3, name: 'Editor lifecycle', item: `${origin}/blog/editor-lifecycle` }
    ] })
  })

  it('creates a two-item breadcrumb when the page has no intermediate section', () => {
    const graphs = createPageSchemas({ home: { name: 'Home', url: `${origin}/` }, current: { name: 'About', url: `${origin}/about` } })
    expect(graphs).toHaveLength(1)
    expect(graphs[0]).toMatchObject({ itemListElement: [{ position: 1 }, { position: 2, item: `${origin}/about` }] })
  })

  it('escapes script-closing text without changing the structured content', () => {
    const graphs = [{ '@type': 'CreativeWork', 'name': '</script><script>alert(1)</script>' }]
    const serialized = serializeJsonLd(graphs)

    expect(serialized).not.toContain('<')
    expect(JSON.parse(serialized)).toEqual(graphs)
  })

  it('generates real second-page paths and excludes unpublished documents', () => {
    const posts = (['en', 'ru'] as const).flatMap(locale => Array.from({ length: 11 }, (_, index) => ({ isPublic: true, metadata: { locale, slug: `article-${index + 1}` } })))
    const paths = createPublicPaths({ projects: [
      { isPublic: true, metadata: { locale: 'en', slug: 'editor-case' } },
      { isPublic: true, metadata: { locale: 'ru', slug: 'editor-case' } },
      { isPublic: false, metadata: { locale: 'en', slug: 'hidden-project' } }
    ], posts: [...posts, { isPublic: false, metadata: { locale: 'en', slug: 'draft-note' } }] })

    expect(paths).toContain('/blog/page/2/')
    expect(paths).toContain('/ru/blog/page/2/')
    expect(paths.some(path => path.includes('draft-note') || path.includes('hidden-project'))).toBe(false)
    expect(paths).toContain('/work/editor-case/')
    expect(paths).toHaveLength(38)
  })

  it('keeps empty blogs to their first page and gives each locale a distinct raster card', () => {
    const paths = createPublicPaths({ projects: [], posts: [] })
    expect(paths).toHaveLength(12)
    expect(paths.some(path => path.includes('/page/'))).toBe(false)
    expect(socialImagePath({ locale: 'en', slug: 'editor-note' })).toBe('/images/social/en/editor-note.png')
    expect(socialImagePath({ locale: 'ru', slug: 'editor-note' })).toBe('/images/social/ru/editor-note.png')
  })

  it('describes certificates as credentials and leaves out links an issuer does not provide', () => {
    const [course, lessons, copy] = createCredentialSchemas({
      origin,
      certificates: [
        { name: 'Learning TypeScript', issuer: 'LinkedIn Learning', issued: '2025-04', category: 'course', url: 'https://example.test/cert', credentialId: 'abc' },
        { name: '200 hours of English lessons', issuer: 'Preply', issued: '2026-09', category: 'lessons', url: '', credentialId: '' },
        { name: 'Vue course', issuer: 'Vue School', issued: '2026-10', category: 'course', url: '/images/certificates/vue.webp' }
      ]
    })

    expect(course).toEqual({
      '@type': 'EducationalOccupationalCredential',
      'name': 'Learning TypeScript',
      'credentialCategory': 'Certificate of completion',
      'recognizedBy': { '@type': 'Organization', 'name': 'LinkedIn Learning' },
      'dateCreated': '2025-04',
      'url': 'https://example.test/cert',
      'identifier': 'abc'
    })
    expect(lessons).not.toHaveProperty('url')
    expect(lessons).not.toHaveProperty('identifier')
    expect(copy?.url).toBe(`${origin}/images/certificates/vue.webp`)
  })
})
