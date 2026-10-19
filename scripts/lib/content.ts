import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join, resolve, sep } from 'node:path'
import matter from 'gray-matter'
import type { z } from 'zod'
import { postSchema, profileSchema, projectSchema } from '../../shared/content-schema'
import { getPublicationDate } from '../../shared/publication'

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

  const imageRoot = resolve(root, 'public/images') + sep
  const imagePath = resolve(root, 'public', metadata.cover.slice(1))
  if (!imagePath.startsWith(imageRoot) || !existsSync(imagePath)) throw new Error(`${source}: cover must reference an existing public image`)
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
        const { data, content: body } = matter(readFileSync(join(directory, filename), 'utf8'))
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
  const excluded = [...projects, ...posts].filter(document => !document.isPublic).map(document => document.source)
  return { projects, posts, profile, excluded }
}
