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
    await expect(page.locator('.recommendation-text')).toContainText(metadata.excerpt.replace(/\*\*/g, ''))
    await expect(page.locator('.recommendation-note')).toHaveCount(0)

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
