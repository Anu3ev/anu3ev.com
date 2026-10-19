import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

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
  await search.fill(article.metadata.title)
  await expect(page.locator('.post-card')).toHaveCount(1)
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

test('the mobile menu supports keyboard open, Escape, focus return and navigation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 })
  await page.goto('/')
  const menu = page.locator('.mobile-menu summary')
  await menu.press('Enter')
  await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '')
  await menu.press('Escape')
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open')
  await expect(menu).toBeFocused()
  await menu.press('Enter')
  await page.locator('.mobile-menu-panel').getByRole('link', { name: 'Blog', exact: true }).click()
  await expect(page.locator('main h1')).toHaveText('Thinking out loud.')
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open')
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
  await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute('href', `mailto:${inventory.profile.email}`)
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
    await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute('href', `mailto:${inventory.profile.email}`)
  }
  finally {
    await context.close()
  }
})
