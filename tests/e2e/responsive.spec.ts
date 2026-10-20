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

for (const frame of frames) {
  test(`${frame.name} contact link rows keep inner space around the hovered text`, async ({ page }) => {
    await page.setViewportSize({ width: frame.width, height: frame.height })
    await page.goto('/contact/')
    const row = page.getByRole('navigation', { name: 'Find me elsewhere' }).getByRole('link').first()
    await row.hover()

    // The surface is the row's ::before; its resolved offsets give its painted box next to the text.
    const geometry = await row.evaluate((link) => {
      const surface = getComputedStyle(link, '::before')
      const rowBox = link.getBoundingClientRect()
      const textBox = link.querySelector('strong')!.getBoundingClientRect()
      const mainBox = link.closest('.main-column')!.getBoundingClientRect()
      return {
        background: surface.backgroundColor,
        surfaceLeft: rowBox.left + Number.parseFloat(surface.left),
        surfaceRight: rowBox.right - Number.parseFloat(surface.right),
        textLeft: textBox.left,
        mainLeft: mainBox.left,
        mainRight: mainBox.right
      }
    })

    expect(geometry.background).not.toBe('rgba(0, 0, 0, 0)')
    expect(geometry.textLeft - geometry.surfaceLeft).toBeGreaterThanOrEqual(12)
    expect(geometry.surfaceLeft).toBeGreaterThan(geometry.mainLeft)
    expect(geometry.surfaceRight).toBeLessThan(geometry.mainRight)
  })
}
