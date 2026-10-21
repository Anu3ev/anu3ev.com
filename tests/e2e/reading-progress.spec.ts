import { expect, test, type Page } from '@playwright/test'

/** Reads the bar's fill as the horizontal scale of its inner line. */
async function readProgress(page: Page) {
  return page.locator('.reading-progress span').evaluate(line => new DOMMatrixReadOnly(getComputedStyle(line).transform).a)
}

for (const [path, content] of [['/blog/vue-3-proxy-deep-comparison/', '.article-body'], ['/work/product-image-editor/', '.reading-layout']] as const) {
  test(`${path} reading progress follows the text from start to end`, async ({ page }) => {
    await page.setViewportSize({ width: 402, height: 874 })
    await page.goto(path)
    await expect(page.locator('.reading-progress')).toHaveAttribute('aria-hidden', 'true')
    expect(await readProgress(page)).toBe(0)

    const middle = await page.locator(content).evaluate((element) => {
      const box = element.getBoundingClientRect()
      return scrollY + box.top + (box.height - innerHeight) / 2
    })
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), middle)
    await expect.poll(() => readProgress(page)).toBeCloseTo(0.5, 1)

    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await expect.poll(() => readProgress(page)).toBe(1)
  })
}

test('pages that are not long reads have no progress bar', async ({ page }) => {
  await page.goto('/about/')
  await expect(page.locator('.reading-progress')).toHaveCount(0)
})
