import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

const engine = readContentInventory().projects.find(({ metadata }) => metadata.slug === 'image-editor' && metadata.locale === 'en')?.metadata

for (const path of ['/work/product-image-editor/', '/ru/work/product-image-editor/']) {
  test(`${path} links straight to the engine's live demo and source code`, async ({ page }) => {
    if (!engine?.demo || !engine.repository) throw new Error('The image editor case must publish its demo and repository')
    await page.goto(path)
    const article = page.locator('.prose')

    for (const href of [engine.demo, engine.repository]) {
      const link = article.locator(`a[href="${href}"]`)
      await expect(link).toHaveCount(1)
      await expect(link).toHaveAttribute('target', '_blank')
    }
  })
}
