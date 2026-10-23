import { describe, expect, it } from 'vitest'
import { readContentInventory } from '../../scripts/lib/content'
import { createLlmsIndex, createPostMarkdown, createProjectMarkdown, markdownPath } from '../../scripts/lib/llms'

const origin = 'https://portfolio.example.test'
const { projects, posts, profile, pages, certificates } = readContentInventory()
const englishProject = projects.find(project => project.isPublic && project.metadata.locale === 'en')!
const englishPost = posts.find(post => post.isPublic && post.metadata.locale === 'en')!

/** Builds one language's index from the published content, as the build does. */
function buildIndex(locale: 'en' | 'ru') {
  return createLlmsIndex({
    locale, origin, profile, pages, certificates,
    projects: projects.filter(project => project.isPublic && project.metadata.locale === locale).map(project => project.metadata),
    posts: posts.filter(post => post.isPublic && post.metadata.locale === locale).map(post => post.metadata)
  })
}

describe('machine-readable copies for AI answer engines', () => {
  it('places each Markdown copy beside its canonical page', () => {
    expect(markdownPath('/work/editor')).toBe('/work/editor/index.md')
    expect(markdownPath('/ru/blog/note/')).toBe('/ru/blog/note/index.md')
  })

  it('opens a case with its facts and makes site links absolute while keeping external ones', () => {
    const markdown = createProjectMarkdown({
      origin,
      project: { ...englishProject, body: 'See [the engine](/work/image-editor/) and ![a shot](/images/a.webp), or [npm](https://www.npmjs.com/).' }
    })

    expect(markdown.startsWith(`# ${englishProject.metadata.title}\n\n> ${englishProject.metadata.description}\n`)).toBe(true)
    expect(markdown).toContain(`- URL: ${origin}/work/${englishProject.metadata.slug}/`)
    expect(markdown).toContain(`- Skills: ${englishProject.metadata.stack.join(', ')}`)
    expect(markdown).toContain(`](${origin}/work/image-editor/)`)
    expect(markdown).toContain(`](${origin}/images/a.webp)`)
    expect(markdown).toContain('](https://www.npmjs.com/)')
  })

  it('opens an article with its URL, date and topic', () => {
    const markdown = createPostMarkdown({ origin, post: englishPost })

    expect(markdown).toContain(`- URL: ${origin}/blog/${englishPost.metadata.slug}/`)
    expect(markdown).toContain(`- Published: ${englishPost.metadata.date}`)
    expect(markdown).toContain(`- Topic: ${englishPost.metadata.category}`)
  })

  it('writes an llms.txt index with a one-line summary and a Markdown link for every published case and article', () => {
    const index = buildIndex('en')
    const [title, , summary] = index.split('\n')

    expect(title).toBe(`# ${profile.name}`)
    expect(summary).toMatch(/^> Senior frontend engineer\. \S/)
    for (const { metadata } of projects.filter(project => project.isPublic && project.metadata.locale === 'en')) {
      expect(index).toContain(`](${origin}/work/${metadata.slug}/index.md): ${metadata.description}`)
    }
    for (const { metadata } of posts.filter(post => post.isPublic && post.metadata.locale === 'en')) {
      expect(index).toContain(`](${origin}/blog/${metadata.slug}/index.md)`)
    }
    expect(index).toContain(`${origin}${profile.cv_en}`)
    expect(index).toContain(`## Optional\n\n- [Full text of every case and article](${origin}/llms-full.txt)\n- [Russian version](${origin}/ru/llms.txt)`)
  })

  it('writes the Russian index for Russian readers, with Russian case links', () => {
    const index = buildIndex('ru')

    expect(index.startsWith(`# ${profile.name_ru}\n\n> Senior frontend-разработчик. `)).toBe(true)
    expect(index).toContain('## Кейсы')
    expect(index).toContain(`](${origin}/ru/work/${englishProject.metadata.slug}/index.md)`)
    expect(index).toContain(`- [English version](${origin}/llms.txt)`)
  })
})
