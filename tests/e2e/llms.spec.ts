import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const { projects, posts, profile } = readContentInventory()

for (const { locale, prefix, name } of [{ locale: 'en', prefix: '', name: profile.name }, { locale: 'ru', prefix: '/ru', name: profile.name_ru }] as const) {
  test(`${prefix || '/'} serves llms.txt and a Markdown copy of every published ${locale} case and article`, async ({ request }) => {
    const index = await request.get(`${prefix}/llms.txt`)
    expect(index.status()).toBe(200)
    expect(index.headers()['content-type']).toMatch(/^text\/plain/)
    expect(await index.text()).toMatch(new RegExp(`^# ${name}\\n`))

    const documents = [
      ...projects.filter(project => project.isPublic && project.metadata.locale === locale).map(project => ({ path: `${prefix}/work/${project.metadata.slug}/index.md`, title: project.metadata.title })),
      ...posts.filter(post => post.isPublic && post.metadata.locale === locale).map(post => ({ path: `${prefix}/blog/${post.metadata.slug}/index.md`, title: post.metadata.title }))
    ]
    for (const { path, title } of documents) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      expect(response.headers()['content-type'], path).toMatch(/^text\/markdown/)
      expect((await response.text()).startsWith(`# ${title}\n`), path).toBe(true)
    }

    const full = await request.get(`${prefix}/llms-full.txt`)
    expect(full.status()).toBe(200)
    expect(await full.text()).toContain(documents[0]!.title)
  })
}

test('cases and articles point to their Markdown copy, other pages do not', async ({ page }) => {
  const project = projects.find(document => document.isPublic && document.metadata.locale === 'en')!
  await page.goto(`/work/${project.metadata.slug}/`)
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute('href', new RegExp(`/work/${project.metadata.slug}/index\\.md$`))

  await page.goto('/about/')
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveCount(0)
})

test('the home Person describes the owner, his topics and languages, and articles credit the same Person', async ({ page }) => {
  await page.goto('/')
  const homeGraphs: Record<string, unknown>[] = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '[]')
  const person = homeGraphs.find(graph => graph['@type'] === 'Person')!

  expect(person.description).toEqual(expect.stringContaining('Vue and TypeScript'))
  expect(person.knowsAbout).toEqual(expect.arrayContaining(['Vue 3', 'TypeScript']))
  expect(person.knowsLanguage).toEqual(['English', 'Russian'])

  const post = posts.find(document => document.isPublic && document.metadata.locale === 'en')!
  await page.goto(`/blog/${post.metadata.slug}/`)
  const articleGraphs: Record<string, unknown>[] = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '[]')
  const article = articleGraphs.find(graph => graph.author) as { author: { '@id': string } }
  expect(article.author['@id']).toBe(person['@id'])
})
