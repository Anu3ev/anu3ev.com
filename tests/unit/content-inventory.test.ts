import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import matter from 'gray-matter'
import { readContentInventory } from '../../scripts/lib/content'

/** Each spec owns one temporary repository; every scenario starts with fresh files. */
const root = mkdtempSync(join(tmpdir(), 'anu3ev-content-'))
const now = new Date('2026-10-20T08:00:00Z')

beforeEach(() => {
  rmSync(root, { recursive: true, force: true })
  mkdirSync(join(root, 'content/settings'), { recursive: true })
  mkdirSync(join(root, 'public/images'), { recursive: true })
  copyFileSync('content/settings/profile.json', join(root, 'content/settings/profile.json'))
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

describe('public content inventory', () => {
  it('loads paired project cases through their distinct metadata contract', () => {
    for (const locale of ['en', 'ru']) {
      const directory = join(root, 'content', locale, 'projects')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'editor-case.md'), matter.stringify('A complete case about a reusable editor. '.repeat(8), {
        title: 'A reusable browser editor', description: 'A case about an editor engine and the product workflow around it.',
        locale, slug: 'editor-case', published: true, cover: '/images/cover.svg', coverAlt: 'A diagram about the editor engine',
        category: 'Open source', year: '2026', role: 'Core library author', stack: ['TypeScript'], featured: true, order: 1
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
})
