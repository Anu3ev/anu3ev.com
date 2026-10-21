import { expect, test, type Page } from '@playwright/test'

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
        await expect(page.locator('.wordmark')).toHaveAccessibleName(/^anu3ev\.com · /)
      }

      if (frame.profile) await expect(page.locator('.profile-sidebar')).toBeVisible()
      else await expect(page.locator('.profile-sidebar')).toBeHidden()
    }
  })
}

for (const frame of frames) {
  test(`${frame.name} home cover keeps its text clear of the shapes and the button on the avatar's line`, async ({ page }) => {
    await page.setViewportSize({ width: frame.width, height: frame.height })
    await page.goto('/')

    const layout = await page.locator('.profile-cover').evaluate((cover) => {
      const shapes = [...cover.querySelectorAll('.cover-shapes i')]
      // Hit-testing follows the rotation; the 13px margin covers the shapes' painted ring.
      const coveredPoints = (text: Element) => {
        const box = text.getBoundingClientRect()
        let count = 0
        for (let x = box.left - 13; x <= box.right + 13; x += 4) {
          for (let y = box.top - 13; y <= box.bottom + 13; y += 4) {
            if (document.elementsFromPoint(x, y).some(element => shapes.includes(element))) count += 1
          }
        }
        return count
      }
      return {
        labelCovered: coveredPoints(cover.querySelector('span')!),
        codeCovered: coveredPoints(cover.querySelector('code')!),
        coverBottom: cover.getBoundingClientRect().bottom,
        button: document.querySelector('.profile-actions .button')!.getBoundingClientRect().toJSON() as DOMRect,
        avatar: document.querySelector('.profile-avatar')!.getBoundingClientRect().toJSON() as DOMRect
      }
    })

    expect(layout.labelCovered).toBe(0)
    expect(layout.codeCovered).toBe(0)
    // Owner's design: the button and the avatar form one row that straddles the cover edge.
    const centre = (box: DOMRect) => box.top + box.height / 2
    expect(Math.abs(centre(layout.button) - centre(layout.avatar))).toBeLessThanOrEqual(1)
    expect(layout.button.top).toBeLessThan(layout.coverBottom)
    expect(layout.button.bottom).toBeGreaterThan(layout.coverBottom)
  })
}

for (const frame of frames) {
  test(`${frame.name} contact link rows span the column with the text inset like the heading`, async ({ page }) => {
    await page.setViewportSize({ width: frame.width, height: frame.height })
    await page.goto('/contact/')
    const row = page.getByRole('navigation', { name: 'Find me elsewhere' }).getByRole('link').first()
    await row.hover()

    const geometry = await row.evaluate((link) => {
      const rowBox = link.getBoundingClientRect()
      const main = link.closest('.main-column')!
      // The column's own borders frame the rows, so compare with its inner edges.
      const mainLeft = main.getBoundingClientRect().left + main.clientLeft
      return {
        background: getComputedStyle(link).backgroundColor,
        rowLeft: rowBox.left,
        rowRight: rowBox.right,
        textLeft: link.querySelector('strong')!.getBoundingClientRect().left,
        headingLeft: document.querySelector('.feed-heading h2')!.getBoundingClientRect().left,
        mainLeft,
        mainRight: mainLeft + main.clientWidth
      }
    })

    expect(geometry.background).not.toBe('rgba(0, 0, 0, 0)')
    expect(geometry.rowLeft).toBeCloseTo(geometry.mainLeft, 0)
    expect(geometry.rowRight).toBeCloseTo(geometry.mainRight, 0)
    expect(geometry.textLeft).toBeCloseTo(geometry.headingLeft, 0)
    expect(geometry.textLeft - geometry.rowLeft).toBeGreaterThanOrEqual(20)
  })
}

/** Resolves the active-item token in the browser's own colour format so it compares with computed styles. */
function readActiveBackground(page: Page) {
  return page.evaluate(() => {
    const probe = document.body.appendChild(document.createElement('span'))
    probe.style.background = 'var(--soft-accent)'
    const color = getComputedStyle(probe).backgroundColor
    probe.remove()
    return color
  })
}

test.describe('touch navigation', () => {
  test.use({ viewport: { width: 402, height: 874 }, isMobile: true, hasTouch: true })

  test('a tapped bottom-navigation item keeps the active highlight under a stuck hover', async ({ page }) => {
    await page.goto('/contact/')
    const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true })
    const activeBackground = await readActiveBackground(page)

    for (const name of ['Home', 'Blog', 'Portfolio', 'Contacts']) {
      const link = navigation.getByRole('link', { name, exact: true })
      await link.tap()
      await expect(link).toHaveAttribute('aria-current', 'page')
      // Touch browsers can leave :hover on the tapped element; pointing at it reproduces that state deterministically.
      await link.hover()
      await expect(link).toHaveCSS('background-color', activeBackground)
    }
  })
})

test('the current page keeps its navigation highlight while the pointer is over it', async ({ page }) => {
  await page.goto('/blog/')
  const link = page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Blog', exact: true })
  const activeBackground = await readActiveBackground(page)

  await link.hover()
  await expect(link).toHaveAttribute('aria-current', 'page')
  await expect(link).toHaveCSS('background-color', activeBackground)
})

for (const frame of frames) {
  test(`${frame.name} article previews show the cover at the article page size`, async ({ page }) => {
    await page.setViewportSize({ width: frame.width, height: frame.height })
    await page.goto('/blog/')
    const card = page.locator('.post-card').first()
    const preview = await card.locator('.post-image-link img').boundingBox()
    const href = await card.locator('h2 a').getAttribute('href')
    if (!preview || !href) throw new Error('The first article card must show a cover and link to its article')

    await page.goto(href)
    const cover = await page.locator('.article-cover').boundingBox()
    if (!cover) throw new Error('The article page must show its cover')

    expect(Math.abs(preview.width - cover.width)).toBeLessThanOrEqual(1)
    expect(Math.abs(preview.height - cover.height)).toBeLessThanOrEqual(1)
  })
}
