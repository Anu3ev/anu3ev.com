import { describe, expect, it } from 'vitest'
import pages from '../../content/settings/pages.json'
import { formatExperiencePeriod, sitePagesSchema } from '../../shared/page-content'

describe('editable page content', () => {
  it('requires complete English and Russian settings and rejects unknown sections', () => {
    expect(sitePagesSchema.safeParse(pages).success).toBe(true)
    expect(sitePagesSchema.safeParse({ en: pages.en }).success).toBe(false)
    expect(sitePagesSchema.safeParse({ ...pages, tracking: {} }).success).toBe(false)
  })

  it('formats verified career periods consistently without relying on the machine timezone', () => {
    expect(formatExperiencePeriod({ start: '2021-10', end: '2026-09', presentLabel: 'Present' })).toBe('10.2021 — 09.2026')
    expect(formatExperiencePeriod({ start: '2026-10', end: '', presentLabel: 'Сейчас' })).toBe('10.2026 — Сейчас')
    expect(formatExperiencePeriod({ start: '2026-10', presentLabel: 'Present' })).toBe('10.2026 — Present')
  })

  it('rejects impossible months, reversed periods and a missing ongoing-role label', () => {
    expect(() => formatExperiencePeriod({ start: '2026-13', presentLabel: 'Present' })).toThrow()
    expect(() => formatExperiencePeriod({ start: '2026-10', end: '2021-10', presentLabel: 'Present' })).toThrow('must not precede')
    expect(() => formatExperiencePeriod({ start: '2026-10', presentLabel: ' ' })).toThrow('label is required')
  })
})
