import { expect, test, type Locator, type Page } from '@playwright/test'

const frames = [
  { name: 'mobile', width: 402, height: 874 },
  { name: 'browser', width: 1440, height: 1024 }
] as const

/** Reads the resolved section rhythm for the current frame, so the test follows the token instead of a copy of it. */
async function readSectionSpace(page: Page) {
  return page.evaluate(() => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--section-space')))
}

/** Vertical distance from the bottom of one element to the top of the next. */
async function measureGap(upper: Locator, lower: Locator) {
  const [top, bottom] = await Promise.all([upper.boundingBox(), lower.boundingBox()])
  if (!top || !bottom) throw new Error('Both blocks must be rendered to measure the gap between them')
  return bottom.y - (top.y + top.height)
}

for (const frame of frames) {
  test(`${frame.name} About blocks are one section space apart`, async ({ page }) => {
    await page.setViewportSize(frame)
    await page.goto('/about/')
    const sectionSpace = await readSectionSpace(page)
    const sections = page.locator('section.page-content')
    const callout = page.locator('.contact-callout')

    expect(await measureGap(page.locator('.page-heading > p').last(), page.locator('.about-grid'))).toBeCloseTo(sectionSpace, 0)
    expect(await measureGap(page.locator('.timeline-item').last(), sections.nth(1).locator('.eyebrow'))).toBeCloseTo(sectionSpace, 0)
    expect(await measureGap(page.locator('.approach-card').last(), callout)).toBeCloseTo(sectionSpace, 0)
    await expect(callout).toHaveCSS('padding-top', `${sectionSpace}px`)
  })

  test(`${frame.name} page headings start one section space below the topbar`, async ({ page }) => {
    await page.setViewportSize(frame)

    for (const path of ['/about/', '/blog/', '/work/', '/contact/', '/privacy/']) {
      await page.goto(path)
      const sectionSpace = await readSectionSpace(page)
      expect(await measureGap(page.locator('.page-topbar'), page.locator('.page-heading .eyebrow').first()), path).toBeCloseTo(sectionSpace, 0)
    }
  })
}
