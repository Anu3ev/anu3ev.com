import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const { certificates } = readContentInventory()
const featured = certificates.filter(certificate => certificate.featured)
const others = certificates.filter(certificate => !certificate.featured)

test('About shows featured certificates as cards with their documents and verifiable links', async ({ page }) => {
  await page.goto('/about/')
  const section = page.getByRole('region', { name: 'Courses and tests' })
  const cards = section.locator('.certificate-card')

  await expect(cards).toHaveCount(featured.length)
  for (const [index, certificate] of featured.entries()) {
    const card = cards.nth(index)
    await expect(card.getByRole('heading', { level: 3 })).toHaveText(certificate.name)
    await expect(card.getByRole('img')).toHaveAttribute('alt', certificate.imageAlt_en)
    await card.getByRole('img').scrollIntoViewIfNeeded()
    await expect.poll(() => card.getByRole('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

    const isIssuerPage = certificate.url.startsWith('https://')
    const link = card.getByRole('link', { name: `View certificate ${certificate.name}${isIssuerPage ? ', opens in a new tab' : ''}` })
    await expect(link).toHaveAttribute('href', certificate.url)
    if (isIssuerPage) await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    else await expect(link).not.toHaveAttribute('target', '_blank')
  }
})

test('every self-hosted certificate copy opens', async ({ request }) => {
  for (const certificate of certificates.filter(({ url }) => url.startsWith('/'))) {
    const response = await request.get(certificate.url)
    expect(response.status(), certificate.url).toBe(200)
    expect(response.headers()['content-type']).toMatch(/^image\//)
  }
})

test('shorter certificates form a list, and one without a public link shows none', async ({ page }) => {
  await page.goto('/about/')
  const items = page.locator('.certificate-list > li')

  await expect(items).toHaveCount(others.length)
  for (const [index, certificate] of others.entries()) {
    const item = items.nth(index)
    await expect(item.locator('strong')).toHaveText(certificate.name)
    if (!certificate.url) {
      await expect(item.getByRole('link')).toHaveCount(0)
      continue
    }

    const row = item.getByRole('link', { name: new RegExp(`^${RegExp.escape(certificate.name)} ${RegExp.escape(certificate.issuer)} .+ View certificate, opens in a new tab$`) })
    await expect(row).toHaveAttribute('href', certificate.url)
    await expect(row).toHaveAttribute('target', '_blank')
  }
})

test('the About page describes every certificate as a credential of the same Person as the home page', async ({ page }) => {
  await page.goto('/about/')
  const graphs: Record<string, unknown>[] = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '[]')
  const person = graphs.find(graph => graph['@type'] === 'Person')

  expect(person?.['@id']).toMatch(/\/#person$/)
  expect(person?.hasCredential).toHaveLength(certificates.length)
  await page.goto('/')
  const homeGraphs: Record<string, unknown>[] = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '[]')
  expect(homeGraphs.find(graph => graph['@type'] === 'Person')?.['@id']).toBe(person?.['@id'])
})

test('Russian certificates keep the issuer names and use the site date style', async ({ page }) => {
  await page.setViewportSize({ width: 402, height: 874 })
  await page.goto('/ru/about/')
  const section = page.getByRole('region', { name: 'Курсы и тесты' })
  const cards = section.locator('.certificate-card')

  await expect(section.getByText('Сертификаты', { exact: true })).toBeVisible()
  await expect(cards.first().locator('time')).toHaveText(featured[0]!.issued.replace(/^(\d{4})-(\d{2})$/, '$2.$1'))
  const [first, second] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()])
  if (!first || !second) throw new Error('Both certificate cards must render on a phone')
  expect(second.y).toBeGreaterThan(first.y + first.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})
