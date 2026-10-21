import { expect, test } from '@playwright/test'

/** Filter toolbars and their shared theme toggle must wait for their actual client handlers. */
const toolbars = [
  { path: '/blog/', initial: 'All topics', topic: 'Architecture' },
  { path: '/work/', initial: 'All work', topic: 'Open source' }
] as const

for (const toolbar of toolbars) {
  test(`${toolbar.path} controls wait for hydration before accepting interaction`, async ({ page }) => {
    const clientScripts = Promise.withResolvers<undefined>()
    await page.route('**/_nuxt/*.js', async (interceptedRoute) => {
      await clientScripts.promise
      await interceptedRoute.continue()
    })

    try {
      // Inspect actual SSR controls while the client entry is deliberately still downloading.
      await page.goto(toolbar.path, { waitUntil: 'commit' })
      const initial = page.getByRole('button', { name: toolbar.initial, exact: true })
      await expect(initial).toBeVisible()
      await expect(initial).toBeDisabled()
      await expect(page.locator('.topic-filter:enabled')).toHaveCount(0)
      const themeToggle = page.getByRole('switch', { name: 'Dark theme', exact: true })
      await expect(themeToggle).toBeDisabled()

      if (toolbar.path === '/blog/') {
        await expect(page.getByRole('searchbox', { name: 'Search articles' })).toBeDisabled()
      }

      clientScripts.resolve(undefined)
      await expect(initial).toBeEnabled()
      await expect(themeToggle).toBeEnabled()
      await themeToggle.click()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
      const topic = page.getByRole('button', { name: toolbar.topic, exact: true })
      await topic.click()
      await expect(topic).toHaveAttribute('aria-pressed', 'true')
      await expect(page).toHaveURL(url => url.searchParams.get('topic') === toolbar.topic)

      if (toolbar.path === '/blog/') {
        const search = page.getByRole('searchbox', { name: 'Search articles' })
        await search.pressSequentially('undo')
        await expect(search).toHaveValue('undo')
        await expect(page).toHaveURL(url => url.searchParams.get('q') === 'undo')
      }
    }
    finally {
      clientScripts.resolve(undefined)
      await page.unrouteAll({ behavior: 'wait' })
    }
  })
}
