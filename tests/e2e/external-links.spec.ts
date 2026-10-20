import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'
import { createPublicPaths } from '../../scripts/lib/routes'

const inventory = readContentInventory()
const paths = createPublicPaths(inventory)

test('external web links open new tabs while internal and email links keep their context', async ({ page, context }) => {
  test.setTimeout(60_000)
  let externalCount = 0

  for (const path of paths) {
    await page.goto(path)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    if (!canonical) throw new Error(`${path} must provide its canonical site origin`)
    const siteOrigin = new URL(canonical).origin
    const pageOrigin = new URL(page.url()).origin
    const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(anchor => ({
      href: anchor.getAttribute('href') || '',
      target: anchor.getAttribute('target'),
      rel: anchor.getAttribute('rel') || ''
    })))

    for (const link of links) {
      const destination = new URL(link.href, page.url())
      const isExternal = ['http:', 'https:'].includes(destination.protocol)
        && destination.origin !== siteOrigin && destination.origin !== pageOrigin

      if (isExternal) {
        externalCount++
        expect(link.target, `${path} → ${link.href}`).toBe('_blank')
        expect(link.rel.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']))
      }
      else {
        expect(link.target, `${path} → ${link.href}`).not.toBe('_blank')
      }
    }
  }

  expect(externalCount).toBeGreaterThan(0)
  await page.goto('/contact/')
  // Test native popup/opener behavior without depending on the external service's availability.
  await context.route(inventory.profile.github, interceptedRoute => interceptedRoute.fulfill({
    status: 200, contentType: 'text/html', body: '<!doctype html><title>Link destination</title><p>External navigation fixture</p>'
  }))
  const openedPage = context.waitForEvent('page')
  await page.locator(`.contact-options a[href="${inventory.profile.github}"]`).click()
  const popup = await openedPage

  try {
    await popup.waitForLoadState('domcontentloaded')
    await expect(popup).toHaveURL(inventory.profile.github)
    expect(await popup.evaluate(() => window.opener === null)).toBe(true)
  }
  finally {
    await popup.close()
    await context.unroute(inventory.profile.github)
  }
})
