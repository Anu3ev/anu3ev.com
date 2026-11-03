import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { applyPositioning, defaultSocialImagePath } from '../../shared/positioning'
import profile from '../../content/settings/profile.json'

const forms = [profile.headline_en, profile.headline_ru, profile.headline_sentence_en, profile.headline_genitive_ru]

describe('the positioning title', () => {
  it('fills every placeholder and rejects an unknown one', () => {
    const settings = { title: 'Hire an {{headline_sentence_en}}', nested: [{ role: '{{headline_genitive_ru}}' }] }

    expect(applyPositioning({ settings, profile })).toEqual({
      title: `Hire an ${profile.headline_sentence_en}`,
      nested: [{ role: profile.headline_genitive_ru }]
    })
    expect(() => applyPositioning({ settings: { title: '{{headline}}' }, profile })).toThrow('{{headline}}')
  })

  it('names the social card after the title, so a new title gets a new URL', () => {
    expect(defaultSocialImagePath('AI-native Senior Frontend Engineer')).toBe('/images/og/ai-native-senior-frontend-engineer.png')
    expect(defaultSocialImagePath('Staff Engineer')).toBe('/images/og/staff-engineer.png')
  })

  it('is written out only in the profile, apart from the README, which cannot use a placeholder', () => {
    for (const file of ['content/settings/pages.json', 'app/i18n/messages.ts', 'scripts/assets/og-default.svg']) {
      const text = readFileSync(file, 'utf8')
      for (const form of forms) expect(text).not.toContain(form)
    }
    expect(readFileSync('README.md', 'utf8')).toContain(profile.headline_sentence_en)
  })
})
