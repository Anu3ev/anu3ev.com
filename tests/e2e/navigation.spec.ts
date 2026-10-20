import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'
import pages from '../../content/settings/pages.json' with { type: 'json' }

const inventory = readContentInventory()
const project = inventory.projects.find(document => document.isPublic && document.metadata.locale === 'en')
const article = inventory.posts.find(document => document.isPublic && document.metadata.locale === 'en')

test('a project opens as a real case and the language switch preserves it', async ({ page }) => {
  test.skip(!project, 'No project is currently published')
  if (!project) return

  await page.goto('/work')
  await page.getByRole('heading', { name: project.metadata.title, exact: true }).getByRole('link').click()
  await expect(page.locator('main h1')).toHaveText(project.metadata.title)
  await expect(page.locator('.prose h2').first()).toBeVisible()
  await page.getByRole('link', { name: 'RU', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/ru/work/${project.metadata.slug}/?$`))
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.locator('.prose h2').first()).toBeVisible()
})

test('blog search, reading, back navigation and a cleared query stay consistent', async ({ page }) => {
  test.skip(!article, 'No article is currently published')
  if (!article) return

  await page.goto('/blog')
  const search = page.getByRole('searchbox', { name: 'Search articles' })
  await search.click()
  await search.pressSequentially(article.metadata.title)
  await expect(search).toHaveValue(article.metadata.title)
  await expect(page.locator('.post-card')).toHaveCount(1)
  await expect(page).toHaveURL(url => url.searchParams.get('q') === article.metadata.title)
  await expect(search).toBeFocused()
  await page.getByRole('heading', { name: article.metadata.title, exact: true }).getByRole('link').click()
  await expect(page.locator('main h1')).toHaveText(article.metadata.title)
  expect(await page.locator('.prose').evaluate(element => element.textContent?.trim().length || 0)).toBeGreaterThan(50)
  await page.goBack()
  await expect(search).toHaveValue(article.metadata.title)
  await search.fill('no-matching-article-7f49a2')
  await expect(page.getByRole('heading', { name: 'No articles found.', exact: true })).toBeVisible()
  await search.clear()
  await expect(page.locator('.post-card')).toHaveCount(Math.min(10, inventory.posts.filter(document => document.isPublic && document.metadata.locale === 'en').length))
})

test('portfolio filters survive reading a case, browser back and a direct reload', async ({ page }) => {
  test.skip(!project, 'No project is currently published')
  if (!project) return

  const category = project.metadata.category
  const matchingProjects = inventory.projects.filter(document => document.isPublic && document.metadata.locale === 'en' && document.metadata.category === category)
  await page.goto('/work')
  const categoryButton = page.getByRole('button', { name: category, exact: true })
  await categoryButton.click()
  await expect(page.locator('.project-card')).toHaveCount(matchingProjects.length)
  await page.getByRole('heading', { name: project.metadata.title, exact: true }).getByRole('link').click()
  await expect(page.locator('main h1')).toHaveText(project.metadata.title)
  await page.goBack()
  await expect(categoryButton).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.project-card')).toHaveCount(matchingProjects.length)
  await expect(page).toHaveURL(url => url.searchParams.get('topic') === category)
  await page.reload()
  await expect(categoryButton).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.project-card')).toHaveCount(matchingProjects.length)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
})

test('a direct filtered blog URL restores its visible input and results after a reload', async ({ page }) => {
  test.skip(!article, 'No article is currently published')
  if (!article) return

  const hydrationMessages: string[] = []
  page.on('console', (message) => {
    if (/hydration/i.test(message.text())) hydrationMessages.push(message.text())
  })
  await page.goto(`/blog?q=${encodeURIComponent(article.metadata.title)}`)
  const search = page.getByRole('searchbox', { name: 'Search articles' })
  await expect(search).toHaveValue(article.metadata.title)
  await expect(page.locator('.post-card')).toHaveCount(1)
  await page.reload()
  await expect(search).toHaveValue(article.metadata.title)
  await expect(page.locator('.post-card')).toHaveCount(1)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  expect(hydrationMessages).toEqual([])
})

test('mobile bottom navigation supports the keyboard and leaves the final content visible', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 })
  await page.goto('/')
  const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true })
  await expect(navigation.getByRole('link')).toHaveCount(4)
  await expect(navigation.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page')
  const blogLink = navigation.getByRole('link', { name: 'Blog', exact: true })
  await blogLink.focus()
  await expect(blogLink).toBeFocused()
  await blogLink.press('Enter')
  await expect(page.locator('main h1')).toHaveText(pages.en.blog.title)
  await expect(blogLink).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.sidebar-top')).toBeHidden()
  const privacy = page.locator('footer').getByRole('link', { name: 'Privacy', exact: true })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await privacy.focus()
  await expect(privacy).toBeFocused()
  const contentBox = await privacy.boundingBox()
  const navigationBox = await page.locator('.site-sidebar').boundingBox()
  if (!contentBox || !navigationBox) throw new Error('Both the focused content and bottom navigation must be visible')
  expect(contentBox.y + contentBox.height).toBeLessThanOrEqual(navigationBox.y)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('the theme survives a reload and contact destinations are real', async ({ page }) => {
  await page.goto('/contact')
  const toggle = page.getByRole('button', { name: 'Switch colour theme', exact: true })
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  const emailLinks = page.locator('main a[href^="mailto:"]')
  expect(await emailLinks.count()).toBeGreaterThan(0)
  for (const link of await emailLinks.all()) {
    await expect(link).toHaveAttribute('href', `mailto:${inventory.profile.email}`)
  }
})

test('unknown and draft URLs return HTTP 404 and the correct locale', async ({ page }) => {
  const draft = await page.goto('/blog/draft-example')
  expect(draft?.status()).toBe(404)
  await expect(page.locator('main h1')).toHaveText('This page wandered off.')
  const russian = await page.goto('/ru/nonexistent-page')
  expect(russian?.status()).toBe(404)
  await expect(page.locator('main h1')).toHaveText('Эта страница потерялась.')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
})

test('article text and native navigation work without JavaScript', async ({ browser }) => {
  test.skip(!article, 'No article is currently published')
  if (!article) return
  const { baseURL } = test.info().project.use
  if (!baseURL) throw new Error('The browser suite requires its configured site origin')
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })

  try {
    const page = await context.newPage()
    await page.goto(`/blog/${article.metadata.slug}`)
    await expect(page.locator('main h1')).toHaveText(article.metadata.title)
    await expect(page.locator('.prose h2').first()).toBeVisible()
    await page.getByRole('link', { name: 'Contacts', exact: true }).first().click()
    await expect(page.locator('main a[href^="mailto:"]').first()).toHaveAttribute('href', `mailto:${inventory.profile.email}`)
  }
  finally {
    await context.close()
  }
})
