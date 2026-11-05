import { describe, expect, it } from 'vitest'
import pages from '../../content/settings/pages.json'
import { formatExperiencePeriod, sitePagesSchema } from '../../shared/page-content'

describe('editable page content', () => {
  it('requires complete English and Russian settings and rejects unknown sections', () => {
    expect(sitePagesSchema.safeParse(pages).success).toBe(true)
    expect(sitePagesSchema.safeParse({ en: pages.en }).success).toBe(false)
    expect(sitePagesSchema.safeParse({ ...pages, tracking: {} }).success).toBe(false)
  })

  it('rejects impossible months, reversed periods and a missing ongoing-role label', () => {
    expect(() => formatExperiencePeriod({ start: '2026-13', presentLabel: 'Present', locale: 'en' })).toThrow()
    expect(() => formatExperiencePeriod({ start: '2026-10', end: '2021-10', presentLabel: 'Present', locale: 'en' })).toThrow('must not precede')
    expect(() => formatExperiencePeriod({ start: '2026-10', presentLabel: ' ', locale: 'en' })).toThrow('label is required')
  })
})
