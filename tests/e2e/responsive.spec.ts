import { expect, test } from '@playwright/test'

/** These are the owner's actual design frames, rather than inferred desktop-to-mobile sizes. */
const frames = [
  { name: 'mobile', width: 402, height: 874, bottomNavigation: true, profile: false },
  { name: 'tablet', width: 1133, height: 744, bottomNavigation: false, profile: false },
  { name: 'browser', width: 1440, height: 1024, bottomNavigation: false, profile: true }
] as const

for (const frame of frames) {
  test(`${frame.name} reference frame keeps navigation and the four page layouts consistent`, async ({ page }) => {
    await page.setViewportSize({ width: frame.width, height: frame.height })

    for (const path of ['/', '/blog/', '/work/', '/contact/']) {
      await page.goto(path)
      await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link')).toHaveCount(4)
      const sidebar = await page.locator('.site-sidebar').boundingBox()
      const main = await page.locator('.main-column').boundingBox()
      const topbar = await page.locator('.page-topbar').boundingBox()
      if (!sidebar || !main || !topbar) throw new Error(`The ${path} layout must expose its navigation and main column`)

      expect(topbar.y).toBe(0)
      expect(topbar.height).toBeCloseTo(frame.bottomNavigation ? 58 : 78, 0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)

      if (frame.bottomNavigation) {
        expect(sidebar.y + sidebar.height).toBe(frame.height)
        expect(sidebar.height).toBeCloseTo(76, 0)
        await expect(page.locator('.sidebar-top')).toBeHidden()
      }
      else {
        expect(sidebar.x + sidebar.width).toBeLessThan(main.x)
        expect(main.width).toBeCloseTo(720, 0)
        await expect(page.locator('.wordmark')).toBeVisible()
      }

      if (frame.profile) await expect(page.locator('.profile-sidebar')).toBeVisible()
      else await expect(page.locator('.profile-sidebar')).toBeHidden()
    }
  })
}
