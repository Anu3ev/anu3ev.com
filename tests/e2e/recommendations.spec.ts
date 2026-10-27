import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const inventory = readContentInventory()
const recommendations = inventory.recommendations.filter(recommendation => recommendation.isPublic)
const withMentions = recommendations.find(recommendation => recommendation.metadata.mentions.length)
const withoutMentions = recommendations.find(recommendation => !recommendation.metadata.mentions.length)
const sourceUrl = `${inventory.profile.linkedin}details/recommendations/`

test('every recommendation has its own page with the full text in both languages', async ({ page }) => {
  for (const { slug, metadata } of recommendations) {
    await page.goto(`/recommendations/${slug}`)
    await expect(page.locator('main h1')).toHaveText(metadata.name)
    await expect(page.locator('.page-topbar')).toContainText('What colleagues say')
    await expect(page.locator('.recommendation-text')).toContainText(metadata.highlight.replace(/\*\*/g, ''))
    await expect(page.locator('.recommendation-note')).toHaveCount(0)
    // Nuxt Content owns a field called `excerpt`; this catches a frontmatter field silently overwritten again.
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', metadata.highlight)

    await page.goto(`/ru/recommendations/${slug}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    await expect(page.locator('main h1')).toHaveText(metadata.name)
    await expect(page.locator('.recommendation-text')).toHaveAttribute('lang', 'en')
    await expect(page.locator('.recommendation-note')).toHaveText('Рекомендация написана на английском, текст приведён без перевода.')
  }
})

test('the source link opens the LinkedIn recommendations in a new tab', async ({ page }) => {
  test.skip(!withMentions, 'No published recommendation')
  if (!withMentions) return

  await page.goto(`/recommendations/${withMentions.slug}`)
  const source = page.getByRole('link', { name: /Read the original on LinkedIn/ })
  await expect(source).toHaveAttribute('href', sourceUrl)
  await expect(source).toHaveAttribute('target', '_blank')
  await expect(source).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute('href', new RegExp(`/recommendations/${withMentions.slug}/index\\.md$`))
})

test('mentioned cases link to their pages, and a text without mentions shows no list', async ({ page }) => {
  test.skip(!withMentions || !withoutMentions, 'Needs recommendations with and without mentions')
  if (!withMentions || !withoutMentions) return

  await page.goto(`/ru/recommendations/${withMentions.slug}`)
  const caseLinks = page.locator('.recommendation-cases a')
  await expect(caseLinks).toHaveCount(withMentions.metadata.mentions.length)
  for (const [index, mention] of withMentions.metadata.mentions.entries()) {
    await expect(caseLinks.nth(index)).toHaveAttribute('href', `/ru/work/${mention.project}/`)
  }
  await caseLinks.first().click()
  await expect(page).toHaveURL(new RegExp(`/ru/work/${withMentions.metadata.mentions[0]?.project}/$`))

  await page.goto(`/recommendations/${withoutMentions.slug}`)
  await expect(page.locator('.recommendation-cases')).toHaveCount(0)
})

test('a recommendation that does not exist returns 404', async ({ page }) => {
  const response = await page.goto('/recommendations/nobody')
  expect(response?.status()).toBe(404)
})

test('the list shows every recommendation newest first, each linking to its page', async ({ page }) => {
  const newestFirst = [...recommendations].sort((first, second) => second.metadata.date.localeCompare(first.metadata.date))
  await page.goto('/recommendations')
  await expect(page.locator('main h1')).toHaveText('People I worked with')
  const cards = page.locator('.recommendation-card')
  await expect(cards).toHaveCount(newestFirst.length)

  for (const [index, { slug, metadata }] of newestFirst.entries()) {
    const card = cards.nth(index)
    await expect(card.locator('h2')).toHaveText(metadata.name)
    await expect(card.locator('p')).toHaveText(metadata.highlight)
    await expect(card.getByRole('link', { name: metadata.name, exact: true })).toHaveAttribute('href', `/recommendations/${slug}/`)
  }

  await page.goto('/ru/recommendations')
  await expect(page.locator('main h1')).toHaveText('Люди, с которыми я работал')
  await expect(cards).toHaveCount(newestFirst.length)
})

test('the menu marks Recommendations as current on the list and on a single page', async ({ page }) => {
  test.skip(!withMentions, 'No published recommendation')
  if (!withMentions) return

  const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true })
  await page.goto('/recommendations')
  await expect(navigation.getByRole('link', { name: 'Recommendations', exact: true })).toHaveAttribute('aria-current', 'page')

  await page.goto(`/recommendations/${withMentions.slug}`)
  await expect(navigation.getByRole('link', { name: 'Recommendations', exact: true })).toHaveClass(/nav-active/)
  await page.getByRole('link', { name: 'All recommendations', exact: true }).click()
  await expect(page).toHaveURL(/\/recommendations\/$/)
})
