import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import matter from 'gray-matter'
import { readContentInventory } from '../../scripts/lib/content'
import { certificatesSchema, profileSchema } from '../../shared/content-schema'

/** Each spec owns one temporary repository; every scenario starts with fresh files. */
const root = mkdtempSync(join(tmpdir(), 'anu3ev-content-'))
const now = new Date('2026-10-20T08:00:00Z')

beforeEach(() => {
  rmSync(root, { recursive: true, force: true })
  mkdirSync(join(root, 'content/settings'), { recursive: true })
  mkdirSync(join(root, 'public/images'), { recursive: true })
  copyFileSync('content/settings/profile.json', join(root, 'content/settings/profile.json'))
  copyFileSync('content/settings/pages.json', join(root, 'content/settings/pages.json'))
  copyFileSync('content/settings/certificates.json', join(root, 'content/settings/certificates.json'))
  mkdirSync(join(root, 'public/images/certificates'), { recursive: true })
  mkdirSync(join(root, 'public/cv'), { recursive: true })
  for (const cv of readdirSync('public/cv')) copyFileSync(join('public/cv', cv), join(root, 'public/cv', cv))
  for (const image of ['vue-master-class-2024.webp', 'vue-master-class-2024-full.webp', 'ef-set-english.webp']) copyFileSync(`public/images/certificates/${image}`, join(root, 'public/images/certificates', image))
  copyFileSync('public/images/alexander.webp', join(root, 'public/images/alexander.webp'))
  copyFileSync('public/images/alexander-avatar.webp', join(root, 'public/images/alexander-avatar.webp'))
  copyFileSync('public/images/vue-lifecycle.svg', join(root, 'public/images/cover.svg'))
})

afterAll(() => rmSync(root, { recursive: true, force: true }))

/** Writes a complete external Markdown input, with only the scenario's important differences exposed. */
function writePost({ locale = 'en', published = false, date = '2026-10-20', cover = '/images/cover.svg', body = 'A complete article about a real editor workflow. '.repeat(8) } = {}) {
  mkdirSync(join(root, 'content', locale, 'posts'), { recursive: true })
  writeFileSync(join(root, 'content', locale, 'posts/working-note.md'), matter.stringify(body, {
    title: 'A working editor note', description: 'A complete description of an editor workflow and its publication boundary.',
    locale, slug: 'working-note', published, date, cover, coverAlt: 'A diagram about editor lifecycle',
    category: 'Engineering', readingMinutes: 3, tags: ['Vue']
  }))
}

/** Writes a recommendation whose text has an emphasised phrase, as LinkedIn authors sometimes type it. */
function writeRecommendation({ filename = 'egor-fedkin.md', highlight = 'He ships complete features.', mentions = [] as { project: string, quote: string }[], featured = undefined as number | undefined } = {}) {
  mkdirSync(join(root, 'content/recommendations'), { recursive: true })
  writeFileSync(join(root, 'content/recommendations', filename), matter.stringify('I worked with Alexander for five years.\n\nHe ships **complete** features.\n', {
    name: 'Egor Fedkin', headline_en: 'Team lead, inSales', headline_ru: 'Тимлид, inSales', relationship: 'managed-directly',
    date: '2026-08-31', profile: 'https://www.linkedin.com/in/egor-fedkin/', highlight, mentions, published: true,
    ...(featured ? { featured } : {})
  }))
}

describe('public content inventory', () => {
  it('accepts unquoted YAML 1.2 date strings, UTF-8 BOM and Windows line endings', () => {
    writePost()
    const path = join(root, 'content/en/posts/working-note.md')
    const source = readFileSync(path, 'utf8').replace(/^date:.*$/m, 'date: 2026-10-20')
    writeFileSync(path, `\uFEFF${source.replace(/\n/g, '\r\n')}`)
    expect(readContentInventory({ root, now }).posts[0]?.metadata.date).toBe('2026-10-20')
  })

  it('rejects executable frontmatter before selecting a parser engine', () => {
    writePost()
    const path = join(root, 'content/en/posts/working-note.md')
    writeFileSync(path, '---javascript\n(() => { throw new Error("Executable frontmatter ran") })()\n---\nA body that must never reach an executable parser.')
    expect(() => readContentInventory({ root, now })).toThrow('only ordinary YAML frontmatter')
  })

  it('validates the profile photo and avatar at the same public-image boundary as case covers', () => {
    const path = join(root, 'content/settings/profile.json')
    const profile = profileSchema.parse(JSON.parse(readFileSync(path, 'utf8')))
    writeFileSync(path, JSON.stringify({ ...profile, photo: '/images/../private.svg' }))
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
    writeFileSync(path, JSON.stringify({ ...profile, photo: '/images/missing.webp' }))
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
    writeFileSync(path, JSON.stringify({ ...profile, avatar: '/images/missing-avatar.webp' }))
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
    writeFileSync(path, JSON.stringify({ ...profile, cv_ru: '/cv/missing.pdf' }))
    expect(() => readContentInventory({ root, now })).toThrow('existing PDF in public/cv')
  })

  it('accepts the published certificates and rejects a card without its preview', () => {
    const path = join(root, 'content/settings/certificates.json')
    const { certificates } = certificatesSchema.parse(JSON.parse(readFileSync(path, 'utf8')))
    expect(readContentInventory({ root, now }).certificates).toHaveLength(certificates.length)

    writeFileSync(path, JSON.stringify({ certificates: [{ ...certificates[0], image: '/images/certificates/missing.webp' }] }))
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
    writeFileSync(path, JSON.stringify({ certificates: [{ ...certificates[0], url: '/images/certificates/missing-copy.webp' }] }))
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
    writeFileSync(path, JSON.stringify({ certificates: [{ ...certificates[0], image: '', summary_ru: '' }] }))
    expect(() => readContentInventory({ root, now })).toThrow('featured certificate needs an image')
  })

  it('rejects incomplete static-page settings before publishing', () => {
    writeFileSync(join(root, 'content/settings/pages.json'), JSON.stringify({ en: {} }))
    expect(() => readContentInventory({ root, now })).toThrow()
  })

  it('loads paired project cases through their distinct metadata contract', () => {
    for (const locale of ['en', 'ru']) {
      const directory = join(root, 'content', locale, 'projects')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'editor-case.md'), matter.stringify('A complete case about a reusable editor. '.repeat(8), {
        title: 'A reusable browser editor', description: 'A case about an editor engine and the product workflow around it.',
        locale, slug: 'editor-case', published: true, cover: '/images/cover.svg', coverAlt: 'A diagram about the editor engine',
        category: 'Open source', year: '2026', context: 'Open source', role: 'Core library author', stack: ['TypeScript'], featured: true, order: 1
      }))
    }

    const inventory = readContentInventory({ root, now })
    expect(inventory.projects.map(project => project.metadata.locale)).toEqual(['en', 'ru'])
    expect(inventory.projects.every(project => project.isPublic)).toBe(true)
    expect(inventory.excluded).toEqual([])
  })

  it('excludes drafts and future entries before creating public collections', () => {
    writePost()
    expect(readContentInventory({ root, now }).excluded).toEqual(['en/posts/working-note.md'])

    writePost({ published: true, date: '2027-01-01' })
    const inventory = readContentInventory({ root, now })
    expect(inventory.posts.filter(post => post.isPublic)).toHaveLength(0)
    expect(inventory.excluded).toHaveLength(1)
  })

  it('requires both published language versions and accepts them as one paired article', () => {
    writePost({ published: true })
    expect(() => readContentInventory({ root, now })).toThrow('publish the ru translation')

    writePost({ locale: 'ru', published: true })
    expect(readContentInventory({ root, now }).posts.filter(post => post.isPublic)).toHaveLength(2)
    expect(readContentInventory({ root, now }).excluded).toEqual([])
  })

  it('rejects an image outside public images and a missing image', () => {
    writePost({ cover: '/images/../private.svg' })
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')

    writePost({ cover: '/images/missing.svg' })
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
  })

  it('checks inline screenshots in the body like covers', () => {
    const body = 'A complete article about a real editor workflow. '.repeat(8)
    writePost({ body: `${body}\n\n![The editor toolbar](/images/cover.svg)` })
    expect(() => readContentInventory({ root, now })).not.toThrow()

    writePost({ body: `${body}\n\n![A missing screenshot](/images/work/missing.webp)` })
    expect(() => readContentInventory({ root, now })).toThrow('existing public image')
    writePost({ body: `${body}\n\n![A remote screenshot](https://example.com/shot.png)` })
    expect(() => readContentInventory({ root, now })).toThrow('public /images/ path')
  })

  it('rejects a second H1 and executable HTML while allowing fenced examples', () => {
    writePost({ body: '# Extra page title' })
    expect(() => readContentInventory({ root, now })).toThrow('use H2 or lower')

    writePost({ body: '<script>alert(1)</script>' })
    expect(() => readContentInventory({ root, now })).toThrow('standard Markdown')

    writePost({ body: '[unsafe link](javascript:alert(1))' })
    expect(() => readContentInventory({ root, now })).toThrow('standard Markdown')

    writePost({ body: '## Code example\n\n```html\n<script>example()</script>\n```' })
    expect(readContentInventory({ root, now }).posts).toHaveLength(1)
  })

  it('rejects incomplete published bodies and metadata that points to another language directory', () => {
    writePost({ published: true, body: 'Not a complete article.' })
    expect(() => readContentInventory({ root, now })).toThrow('complete body')

    writePost()
    const path = join(root, 'content/en/posts/working-note.md')
    const original = readFileSync(path, 'utf8')
    const mismatched = original.replace('locale: en', 'locale: ru')
    expect(mismatched).not.toBe(original)
    writeFileSync(path, mismatched)
    expect(() => readContentInventory({ root, now })).toThrow('locale and slug')
  })

  it('accepts a recommendation whose highlight is copied from the text, ignoring emphasis and line wrapping', () => {
    writeRecommendation()
    const [recommendation] = readContentInventory({ root, now }).recommendations
    expect(recommendation?.slug).toBe('egor-fedkin')
    expect(recommendation?.isPublic).toBe(true)
  })

  it('rejects a reworded highlight and a quote about a case that is not published', () => {
    writeRecommendation({ highlight: 'He always ships complete features.' })
    expect(() => readContentInventory({ root, now })).toThrow('must be copied from the recommendation text')

    writeRecommendation({ mentions: [{ project: 'missing-case', quote: 'I worked with Alexander for five years.' }] })
    expect(() => readContentInventory({ root, now })).toThrow('which is not a published case')
  })

  it('rejects a filename that cannot be a page address and an About position used twice', () => {
    writeRecommendation({ filename: 'Egor Fedkin.md' })
    expect(() => readContentInventory({ root, now })).toThrow('lowercase, hyphenated slug')

    rmSync(join(root, 'content/recommendations'), { recursive: true })
    writeRecommendation({ filename: 'egor-fedkin.md', featured: 1 })
    writeRecommendation({ filename: 'andrey-stikheev.md', featured: 1 })
    expect(() => readContentInventory({ root, now })).toThrow('each featured position may be used once')
  })
})
