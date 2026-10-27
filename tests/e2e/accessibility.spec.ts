import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const inventory = readContentInventory()
const project = inventory.projects.find(document => document.isPublic && document.metadata.locale === 'en')
const article = inventory.posts.find(document => document.isPublic && document.metadata.locale === 'en')
const recommendation = inventory.recommendations.find(document => document.isPublic && document.metadata.mentions.length)
const paths = [
  '/', '/blog', '/work', '/recommendations', '/contact', '/about', '/privacy',
  ...(project ? [`/work/${project.metadata.slug}`] : []),
  ...(article ? [`/blog/${article.metadata.slug}`] : []),
  ...(recommendation ? [`/recommendations/${recommendation.slug}`] : [])
]

for (const locale of ['en', 'ru']) {
  for (const theme of ['dark', 'light']) {
    for (const path of paths) {
      const localizedPath = locale === 'ru' ? `/ru${path === '/' ? '' : path}` : path

      test(`${locale} ${theme} ${path}: semantic controls and WCAG checks`, async ({ page }) => {
        await page.addInitScript(preference => localStorage.setItem('anu3ev-theme', preference), theme)
        await page.goto(localizedPath)
        await expect(page.locator('main h1')).toHaveCount(1)
        await page.evaluate(() => document.fonts.ready.then(() => true))
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
        expect(results.violations).toEqual([])

        const unnamedControls = await page.locator('button,input,select,textarea,summary,a[href]').evaluateAll(controls => controls.filter(control => !control.getAttribute('title')?.trim()).map(control => control.outerHTML.slice(0, 160)))
        expect(unnamedControls).toEqual([])
      })
    }
  }
}

test('all public templates reflow at 320 px in both languages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 })

  for (const locale of ['en', 'ru']) {
    for (const path of paths) {
      const localizedPath = locale === 'ru' ? `/ru${path === '/' ? '' : path}` : path
      await page.goto(localizedPath)
      await expect(page.locator('main h1')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${localizedPath} overflows 320px`).toBe(false)
    }
  }
})

for (const theme of ['dark', 'light']) {
  test(`mobile home ${theme}: cover graphics preserve text contrast`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.addInitScript(preference => localStorage.setItem('anu3ev-theme', preference), theme)
    await page.goto('/ru')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations).toEqual([])
  })
}
