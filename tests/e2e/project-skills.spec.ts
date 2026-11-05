import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

/** The longest skill list proves both the card limit and the complete case list. */
const project = readContentInventory().projects
  .filter(document => document.isPublic && document.metadata.locale === 'en')
  .map(document => document.metadata)
  .sort((first, second) => second.stack.length - first.stack.length)[0]

test('a portfolio card leaves the skills out, and the case lists them all', async ({ page }) => {
  if (!project || project.stack.length <= 3) throw new Error('The portfolio needs a case with more than three skills')
  await page.goto('/work/')
  const card = page.locator('.project-card').filter({ has: page.getByTitle(`Read case study: ${project.title}`, { exact: true }) })

  await expect(card.getByRole('list', { name: 'Skills' })).toHaveCount(0)
  await page.goto(`/work/${project.slug}/`)
  await expect(page.locator('.case-facts').getByRole('listitem')).toHaveText(project.stack)
})
