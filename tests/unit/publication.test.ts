import { describe, expect, it } from 'vitest'
import { getPublicationDate } from '../../shared/publication'
import { postSchema, projectSchema } from '../../shared/content-schema'

describe('editorial publication boundary', () => {
  it('uses the owner’s calendar date rather than the UTC build runner’s date', () => {
    expect(getPublicationDate(new Date('2026-10-19T19:59:59Z'))).toBe('2026-10-19')
    expect(getPublicationDate(new Date('2026-10-19T20:00:00Z'))).toBe('2026-10-20')
  })

  it('rejects impossible dates and unsafe external destinations', () => {
    expect(postSchema.shape.date.safeParse('2026-02-30').success).toBe(false)
    expect(projectSchema.shape.demo.safeParse('javascript:alert(1)').success).toBe(false)
    expect(projectSchema.shape.demo.safeParse('https://anu3ev.github.io/image-editor/').success).toBe(true)
  })

  it('requires route-safe slugs and keeps new documents unpublished by default', () => {
    expect(postSchema.shape.slug.safeParse('../private').success).toBe(false)
    expect(postSchema.shape.slug.safeParse('page').success).toBe(false)
    expect(postSchema.shape.published.parse(undefined)).toBe(false)
  })
})
