import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { readContentInventory } from '../../scripts/lib/content'
import pages from '../../content/settings/pages.json' with { type: 'json' }

const inventory = readContentInventory()
const article = inventory.posts.find(document => document.isPublic && document.metadata.locale === 'ru')

test('the sitemap exposes complete HTML pages and robots identifies the same origin', async ({ page, request }) => {
  test.setTimeout(90_000)
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  await page.goto('/')
  const urls = await page.evaluate((xmlSource) => {
    const sitemapDocument = new DOMParser().parseFromString(xmlSource, 'application/xml')
    if (sitemapDocument.querySelector('parsererror')) throw new Error('Invalid sitemap XML')
    return [...sitemapDocument.querySelectorAll('loc')].map(node => node.textContent || '')
  }, await sitemap.text())

  expect(urls.length).toBeGreaterThanOrEqual(12)
  expect(new Set(urls).size).toBe(urls.length)
  expect(urls.some(url => /admin|draft-example|404/.test(url))).toBe(false)
  const origin = new URL(urls[0] || '').origin
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`)

  for (const url of urls) {
    const path = new URL(url).pathname
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)
    const html = await response.text()
    expect(html, path).toMatch(/<h1[^>]*>[\s\S]+?<\/h1>/)
    expect(html, path).toContain('name="description"')
    expect(html, path).toContain('application/ld+json')
  }
})

test('localized feeds contain only published articles and valid XML', async ({ page, request }) => {
  await page.goto('/')

  for (const locale of ['en', 'ru'] as const) {
    const response = await request.get(locale === 'ru' ? '/ru/rss.xml' : '/rss.xml')
    expect(response.status()).toBe(200)
    const feed = await page.evaluate((xmlSource) => {
      const feedDocument = new DOMParser().parseFromString(xmlSource, 'application/xml')
      if (feedDocument.querySelector('parsererror')) throw new Error('Invalid RSS XML')
      return { count: feedDocument.querySelectorAll('item').length, title: feedDocument.querySelector('channel > title')?.textContent, language: feedDocument.querySelector('language')?.textContent, text: feedDocument.documentElement.textContent }
    }, await response.text())
    expect(feed.language).toBe(locale)
    const ownerName = locale === 'ru' ? inventory.profile.name_ru : inventory.profile.name
    expect(feed.title).toBe(`${ownerName} — ${pages[locale].blog.title}`)
    expect(feed.count).toBe(inventory.posts.filter(document => document.isPublic && document.metadata.locale === locale).length)
    expect(feed.text).not.toContain('DRAFT_ONLY_DO_NOT_SHIP_7f49a2')
  }
})

test('article head metadata agrees with its canonical URL, language pair and raster social card', async ({ page, request }) => {
  test.skip(!article, 'No article is currently published')
  if (!article) return
  await page.goto(`/ru/blog/${article.metadata.slug}`)
  await expect(page.locator('main h1')).toHaveText(article.metadata.title)
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  expect(canonical).toMatch(new RegExp(`/ru/blog/${article.metadata.slug}/$`))
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', new RegExp(`/blog/${article.metadata.slug}/$`))
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')

  const image = await page.locator('meta[property="og:image"]').getAttribute('content')
  if (!image) throw new Error('An article must provide its Open Graph image')
  const imageResponse = await request.get(new URL(image).pathname)
  expect(imageResponse.status()).toBe(200)
  const dimensions = await sharp(await imageResponse.body()).metadata()
  expect([dimensions.width, dimensions.height]).toEqual([1200, 630])

  const serialized = await page.locator('script[type="application/ld+json"]').textContent()
  if (!serialized) throw new Error('An article must provide its JSON-LD graphs')
  const graphs: unknown = JSON.parse(serialized)
  expect(graphs).toEqual(expect.arrayContaining([
    expect.objectContaining({ '@type': 'BlogPosting', 'mainEntityOfPage': canonical, 'headline': article.metadata.title, image }),
    expect.objectContaining({ '@type': 'BreadcrumbList' })
  ]))
})

test('the CMS exposes only its configured authentication method', async ({ page }) => {
  const configurationMessages: string[] = []
  page.on('console', (message) => {
    if (!['error', 'warning'].includes(message.type()) || !message.location().url.includes('/admin/cms.js')) return
    // The CMS is pinned deliberately; its notice about a newer release is not a configuration problem.
    if (/A new version \(.+\) is available/.test(message.text())) return

    configurationMessages.push(message.text())
  })
  await page.goto('/admin/')
  await expect(page.getByRole('heading', { name: 'Sveltia CMS', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign In Using Access Token', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /Sign In with/ })).toHaveCount(0)
  const directives = await page.locator('meta[name="robots"]').evaluateAll(tags => tags.map(tag => tag.getAttribute('content') || ''))
  expect(directives).toContain('noindex, nofollow')
  expect(directives.every(value => value.includes('noindex'))).toBe(true)
  expect(configurationMessages).toEqual([])
})

test('editable settings drive public page content, author metadata, photos and career in both languages', async ({ page }) => {
  test.setTimeout(60_000)
  const { profile } = inventory

  for (const locale of ['en', 'ru'] as const) {
    const settings = pages[locale]
    const prefix = locale === 'ru' ? '/ru' : ''
    const ownerName = locale === 'ru' ? profile.name_ru : profile.name
    await page.goto(prefix || '/')
    await expect(page.locator('main h1')).toContainText(ownerName)
    await expect(page.locator('#pinned-note-title')).toHaveText(settings.home.pinnedTitle)
    await expect(page.locator('.profile-highlights li')).toHaveText(settings.home.highlights.map(item => `${item.value} ${item.label}`))
    await expect(page.locator('.profile-location')).toContainText(locale === 'ru' ? profile.location_ru : profile.location)
    // Relocation is part of the offer on the first screen, in the same words as the Contacts arrangements.
    const relocation = settings.contact.arrangements.find(item => /relocation|релокация/i.test(item))
    if (!relocation) throw new Error(`The ${locale} contact arrangements must mention relocation`)
    await expect(page.locator('.profile-location')).toContainText(relocation)
    await expect(page).toHaveTitle(`${settings.home.seoTitle} · ${ownerName}`)
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', ownerName)
    // Every avatar on the page shows the CMS photo crop and has actually loaded.
    const avatars = page.locator('.profile-avatar img, .small-avatar img, .tiny-avatar img')
    await expect(avatars.first()).toBeVisible()
    for (const avatar of await avatars.all()) {
      await expect(avatar).toHaveAttribute('src', profile.avatar)
      await expect.poll(() => avatar.evaluate(image => image instanceof HTMLImageElement ? image.naturalWidth : 0)).toBeGreaterThan(0)
    }
    const homeGraphs: unknown = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '[]')
    expect(homeGraphs).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'Person', 'image': expect.stringMatching(/^https:\/\/.+\/images\/[^/]+$/) })
    ]))
    expect(JSON.stringify(homeGraphs)).toContain(profile.photo)

    await page.goto(`${prefix}/about`)
    await expect(page.locator('main h1')).toHaveText(settings.about.title)
    await expect(page.locator('img.about-photo')).toHaveAttribute('src', profile.photo)
    await expect(page.locator('img.about-photo')).toHaveAttribute('alt', ownerName)
    await expect.poll(() => page.locator('img.about-photo').evaluate(image => image instanceof HTMLImageElement ? image.naturalWidth : 0)).toBeGreaterThan(0)
    await expect(page.locator('.timeline-item')).toHaveCount(settings.about.experience.length)
    for (const job of settings.about.experience) {
      await expect(page.getByRole('heading', { name: `${job.role} · ${job.company}`, exact: true })).toBeVisible()
    }

    await page.goto(`${prefix}/privacy`)
    await expect(page.locator('main h1')).toHaveText(settings.privacy.title)
    await expect(page.locator('main time')).toHaveAttribute('datetime', settings.privacy.updated)
    await expect(page.locator('main')).toContainText(settings.privacy.storage)
    await page.goto(`${prefix}/contact`)
    await expect(page.locator('main h1')).toHaveText(settings.contact.title)
    await expect(page.locator('main .availability')).toHaveCount(profile.available ? 1 : 0)
  }
})

test('font preload URLs stay unique through hydration and locale navigation', async ({ page }) => {
  await page.goto('/ru')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  const fonts = page.locator('link[rel="preload"][as="font"]')
  await expect(fonts).toHaveCount(2)
  const initial = await fonts.evaluateAll(links => links.map(link => link.getAttribute('href')))
  expect(new Set(initial).size).toBe(2)
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('link', { name: 'RU', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(fonts).toHaveCount(2)
})
