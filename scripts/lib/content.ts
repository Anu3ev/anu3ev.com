import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join, resolve, sep } from 'node:path'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import type { z } from 'zod'
import { certificatesSchema, postSchema, profileSchema, projectSchema, recommendationSchema, slugSchema } from '../../shared/content-schema'
import { getPublicationDate } from '../../shared/publication'
import { sitePagesSchema } from '../../shared/page-content'

/** Parsed source document with its build-time publication decision. */
interface ContentDocument<Metadata> {
  source: string
  body: string
  metadata: Metadata
  isPublic: boolean
}

/** Prevents accidental H1 duplication, active HTML, broken evidence images and mismatched language routes. */
function validateDocument({ document, root }: { document: ContentDocument<z.infer<typeof postSchema> | z.infer<typeof projectSchema>>, root: string }) {
  const { source, body, metadata, isPublic } = document
  if (metadata.locale !== source.split('/')[0] || metadata.slug !== basename(source, '.md')) {
    throw new Error(`${source}: locale and slug must match their directory and filename`)
  }
  if (isPublic && body.trim().length < 100) throw new Error(`${source}: published documents need a complete body`)

  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  if (/^#\s/m.test(prose)) throw new Error(`${source}: use H2 or lower in the body; the page already has an H1`)
  if (/<\/?[a-z][^>]*>/i.test(prose) || /\]\(\s*(?:javascript|data|vbscript):/i.test(prose)) {
    throw new Error(`${source}: use standard Markdown; executable HTML and unsafe links are not supported`)
  }

  validatePublicImage({ root, image: metadata.cover, source })
  // Inline screenshots are evidence too: a mistyped path must fail the build, not ship a broken image.
  for (const match of prose.matchAll(/!\[[^\]]*\]\((?<image>[^)\s]+)[^)]*\)/g)) {
    const image = match.groups?.image ?? ''
    if (!/^\/images\/[^?#]+\.(?:webp|png|jpe?g|svg)$/i.test(image)) throw new Error(`${source}: inline images must use a public /images/ path`)
    validatePublicImage({ root, image, source })
  }
}

/** Every editable image must resolve inside the public image directory before static generation. */
function validatePublicImage({ root, image, source }: { root: string, image: string, source: string }) {
  const imageRoot = resolve(root, 'public/images') + sep
  const imagePath = resolve(root, 'public', image.slice(1))
  if (!imagePath.startsWith(imageRoot) || !existsSync(imagePath)) throw new Error(`${source}: image must reference an existing public image`)
}

/** A CV link is a public download; a missing or misplaced PDF would ship as a broken button. */
function validatePublicCv({ root, cv }: { root: string, cv: string }) {
  const cvRoot = resolve(root, 'public/cv') + sep
  const cvPath = resolve(root, 'public', cv.slice(1))
  if (!cvPath.startsWith(cvRoot) || !existsSync(cvPath)) throw new Error('settings/profile.json: CV must reference an existing PDF in public/cv')
}

/** Owns the file format boundary: BOM/CRLF support, non-executable YAML and date-only string semantics. */
function readEditorialSource({ path, source }: { path: string, source: string }): { data: unknown, content: string } {
  const input = readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
  // Tagged JavaScript frontmatter would select gray-matter's executable engine before schema validation.
  if (!/^---[ \t]*\r?\n/.test(input)) throw new Error(`${source}: only ordinary YAML frontmatter is supported`)
  return matter(input, { engines: { yaml: text => parseYaml(text) } })
}

/** Published locale pairs are required so hreflang and the language switch always have real targets. */
function validateTranslations(documents: ContentDocument<{ slug: string, locale: 'en' | 'ru' }>[]) {
  const publicRoutes = new Set(documents.filter(document => document.isPublic).map(document => `${document.metadata.locale}/${document.metadata.slug}`))

  for (const document of documents) {
    if (!document.isPublic) continue
    const { slug, locale } = document.metadata
    const alternate = locale === 'en' ? 'ru' : 'en'
    if (!publicRoutes.has(`${alternate}/${slug}`)) throw new Error(`${document.source}: publish the ${alternate} translation together with this document`)
  }
}

/** Reads only the two declared locales and collection directories; drafts never enter a public content database. */
export function readContentInventory({ root = process.cwd(), now = new Date() } = {}) {
  const projects: ContentDocument<z.infer<typeof projectSchema>>[] = []
  const posts: ContentDocument<z.infer<typeof postSchema>>[] = []
  const today = getPublicationDate(now)

  for (const locale of ['en', 'ru']) {
    for (const kind of ['projects', 'posts']) {
      const directory = join(root, 'content', locale, kind)
      if (!existsSync(directory)) continue

      for (const filename of readdirSync(directory).filter(name => name.endsWith('.md')).sort()) {
        const source = `${locale}/${kind}/${filename}`
        const { data, content: body } = readEditorialSource({ path: join(directory, filename), source })
        if (kind === 'projects') {
          const metadata = projectSchema.parse(data)
          const document = { source, body, metadata, isPublic: metadata.published }
          validateDocument({ document, root })
          projects.push(document)
          continue
        }

        const metadata = postSchema.parse(data)
        const document = { source, body, metadata, isPublic: metadata.published && metadata.date <= today }
        validateDocument({ document, root })
        posts.push(document)
      }
    }
  }

  validateTranslations(projects)
  validateTranslations(posts)
  const profileInput: unknown = JSON.parse(readFileSync(join(root, 'content/settings/profile.json'), 'utf8'))
  const profile = profileSchema.parse(profileInput)
  validatePublicImage({ root, image: profile.photo, source: 'settings/profile.json' })
  validatePublicImage({ root, image: profile.avatar, source: 'settings/profile.json' })
  for (const cv of [profile.cv_en, profile.cv_ru]) validatePublicCv({ root, cv })
  const pagesInput: unknown = JSON.parse(readFileSync(join(root, 'content/settings/pages.json'), 'utf8'))
  const pages = sitePagesSchema.parse(pagesInput)
  const certificates = readCertificates(root)
  const recommendations = readRecommendations({ root, projects })
  const excluded = [...projects, ...posts, ...recommendations].filter(document => !document.isPublic).map(document => document.source)
  return { projects, posts, profile, pages, certificates, recommendations, excluded }
}

/** Compares wording only: Markdown emphasis and line wrapping must not hide a real difference. */
function normalizeWording(text: string) {
  return text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()
}

/**
 * Recommendations are someone else's words: every excerpt and quote must be copied from the text unchanged,
 * every mentioned case must exist, and each About position may be used once.
 */
function readRecommendations({ root, projects }: { root: string, projects: readonly ContentDocument<z.infer<typeof projectSchema>>[] }) {
  const directory = join(root, 'content', 'recommendations')
  if (!existsSync(directory)) return []

  const publicCases = new Set(projects.filter(project => project.isPublic).map(project => project.metadata.slug))
  const recommendations: (ContentDocument<z.infer<typeof recommendationSchema>> & { slug: string })[] = []
  for (const filename of readdirSync(directory).filter(name => name.endsWith('.md')).sort()) {
    const source = `recommendations/${filename}`
    // The filename is the page address, so it follows the same rule as case and article slugs.
    const slug = basename(filename, '.md')
    if (!slugSchema.safeParse(slug).success) throw new Error(`${source}: the filename must be a lowercase, hyphenated slug`)
    const { data, content: body } = readEditorialSource({ path: join(directory, filename), source })
    const metadata = recommendationSchema.parse(data)
    const text = normalizeWording(body)
    for (const sentence of [metadata.excerpt, ...metadata.mentions.map(mention => mention.quote)]) {
      if (!text.includes(normalizeWording(sentence))) throw new Error(`${source}: "${sentence}" must be copied from the recommendation text`)
    }
    for (const { project } of metadata.mentions) {
      if (!publicCases.has(project)) throw new Error(`${source}: mentions "${project}", which is not a published case`)
    }

    recommendations.push({ source, body, metadata, isPublic: metadata.published, slug })
  }

  const featured = recommendations.filter(recommendation => recommendation.isPublic && recommendation.metadata.featured).map(recommendation => recommendation.metadata.featured)
  if (new Set(featured).size !== featured.length) throw new Error('recommendations: each featured position may be used once')
  return recommendations
}

/** Certificates are public evidence: every preview must be an existing public image, like a case cover. */
function readCertificates(root: string) {
  const input: unknown = JSON.parse(readFileSync(join(root, 'content/settings/certificates.json'), 'utf8'))
  const { certificates } = certificatesSchema.parse(input)
  for (const certificate of certificates) {
    if (certificate.image) validatePublicImage({ root, image: certificate.image, source: 'settings/certificates.json' })
    if (certificate.url.startsWith('/')) validatePublicImage({ root, image: certificate.url, source: 'settings/certificates.json' })
  }

  return certificates
}
