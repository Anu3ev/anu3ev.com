import { expect, test } from '@playwright/test'

/** Long reads of both kinds carry the same outline. */
const longReads = ['/work/product-image-editor/', '/blog/vue-3-proxy-deep-comparison/'] as const

for (const path of longReads) {
  test(`${path} desktop outline stays open when its heading is clicked`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 })
    await page.goto(path)
    const outline = page.locator('details.table-of-contents')
    const sections = outline.getByRole('navigation', { name: 'On this page' }).getByRole('link')

    await expect(outline).toHaveAttribute('open', '')
    expect(await sections.count()).toBeGreaterThan(2)
    await outline.locator('summary').click()
    await expect(outline).toHaveAttribute('open', '')
    await expect(sections.first()).toBeVisible()
  })

  test(`${path} mobile outline is one row until it is tapped`, async ({ page }) => {
    await page.setViewportSize({ width: 402, height: 874 })
    await page.goto(path)
    const outline = page.locator('details.table-of-contents')
    const summary = outline.locator('summary')
    const firstSection = outline.getByRole('link').first()

    await expect(outline).not.toHaveAttribute('open')
    await expect(firstSection).toBeHidden()
    expect((await summary.boundingBox())?.height).toBeGreaterThanOrEqual(44)
    await summary.click()
    await expect(firstSection).toBeVisible()
    await firstSection.click()
    await expect(page).toHaveURL(/#.+/)
  })
}

test('the mobile outline is collapsed from the first paint, before hydration', async ({ page }) => {
  await page.setViewportSize({ width: 402, height: 874 })
  await page.route('**/_nuxt/*.js', route => route.abort())
  await page.goto('/blog/vue-3-proxy-deep-comparison/')
  const outline = page.locator('details.table-of-contents')

  await expect(outline.locator('summary')).toBeVisible()
  await expect(outline.getByRole('link').first()).toBeHidden()
})
