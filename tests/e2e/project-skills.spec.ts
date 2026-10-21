import { expect, test } from '@playwright/test'
import { readContentInventory } from '../../scripts/lib/content'

/** The longest skill list proves both the card limit and the complete case list. */
const project = readContentInventory().projects
  .filter(document => document.isPublic && document.metadata.locale === 'en')
  .map(document => document.metadata)
  .sort((first, second) => second.stack.length - first.stack.length)[0]

test('a portfolio card names three skills and counts the rest, the case lists them all', async ({ page }) => {
  if (!project || project.stack.length <= 3) throw new Error('The portfolio needs a case with more than three skills')
  await page.goto('/work/')
  const card = page.locator('.project-card').filter({ has: page.getByTitle(`Read case study: ${project.title}`, { exact: true }) })
  const skills = card.getByRole('list', { name: 'Skills' }).getByRole('listitem')

  await expect(skills).toHaveText([...project.stack.slice(0, 3), `+${project.stack.length - 3} more`])
  await page.goto(`/work/${project.slug}/`)
  await expect(page.locator('.case-facts').getByRole('listitem')).toHaveText(project.stack)
})
