import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const { profile } = readContentInventory()

for (const { locale, path, label } of [
  { locale: 'en', path: '/', label: 'Download CV' },
  { locale: 'ru', path: '/ru/contact/', label: 'Скачать резюме' }
] as const) {
  test(`${path} offers the ${locale} CV as a same-tab PDF download`, async ({ page, request }) => {
    await page.goto(path)
    const link = page.getByRole('main').getByRole('link', { name: label })
    const cv = locale === 'en' ? profile.cv_en : profile.cv_ru

    await expect(link).toHaveAttribute('href', cv)
    await expect(link).toHaveAttribute('download', '')
    await expect(link).not.toHaveAttribute('target', '_blank')
    const response = await request.get(cv)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('application/pdf')
  })
}

test('the published CVs carry no phone number', async ({ request }) => {
  for (const cv of [profile.cv_en, profile.cv_ru]) {
    const body = (await (await request.get(cv)).body()).toString('latin1')
    expect(body, cv).not.toContain('tel:')
  }
})
