import { expect, test } from '@playwright/test'

/** Separate SSG export from scripts/serve-pagination-fixture.ts; it is not the configured baseURL. */
const fixtureOrigin = 'http://127.0.0.1:4174'

/** The isolated fixture spreads 12 articles evenly over three categories per locale. */
const locales = [
  { prefix: '', blog: 'Blog', allTopics: 'All topics', topic: 'Product UX', search: 'Search articles' },
  { prefix: '/ru', blog: 'Блог', allTopics: 'Все темы', topic: 'Продуктовый UX', search: 'Поиск статей' }
]

for (const { prefix, blog, allTopics, topic, search: searchName } of locales) {
  test(`${prefix || '/en'}: All topics lists every category and a category name is searchable`, async ({ page }) => {
    await page.goto(`${fixtureOrigin}${prefix}/`)
    await page.getByRole('link', { name: blog, exact: true }).first().click()
    await expect(page).toHaveURL(new RegExp(`${prefix}/blog/?$`))
    const status = page.locator('.blog-results-count')
    await expect(status).toContainText('12')
    await expect(page.locator('.post-card')).toHaveCount(10)

    const topicButton = page.getByRole('button', { name: topic, exact: true })
    const allTopicsButton = page.getByRole('button', { name: allTopics, exact: true })
    await topicButton.click()
    await expect(topicButton).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.post-card')).toHaveCount(4)
    await allTopicsButton.click()
    await expect(allTopicsButton).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(url => !url.searchParams.has('topic'))
    await expect(status).toContainText('12')

    const search = page.getByRole('searchbox', { name: searchName })
    await search.click()
    await search.pressSequentially(topic)
    await expect(page).toHaveURL(url => url.searchParams.get('q') === topic)
    await expect(page.locator('.post-card')).toHaveCount(4)
    await page.reload()
    await expect(search).toHaveValue(topic)
    await expect(page.locator('.post-card')).toHaveCount(4)
    await search.clear()
    await expect(status).toContainText('12')
  })
}
