import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const { profile } = readContentInventory()

for (const { path, label } of [
  { path: '/', label: 'Book a call' },
  { path: '/ru/', label: 'Созвониться' },
  { path: '/contact/', label: 'Book a call 30-minute video call' },
  { path: '/ru/contact/', label: 'Созвониться Видеозвонок на 30 минут' }
]) {
  test(`${path} offers the Calendly booking page in a new tab`, async ({ page }) => {
    await page.goto(path)
    const link = page.getByRole('main').getByRole('link', { name: label, exact: true })

    await expect(link).toHaveAttribute('href', profile.calendly)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
}
