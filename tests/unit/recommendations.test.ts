import { describe, expect, it } from 'vitest'
import { findCaseMentions, type MentionSource } from '../../shared/recommendations'

/** A recommendation that mentions the editor case unless told otherwise. */
function source(overrides: Partial<MentionSource> & { slug: string }): MentionSource {
  return {
    name: overrides.slug, date: '2026-09-01', published: true,
    mentions: [{ project: 'editor', quote: `${overrides.slug} on the editor.` }],
    ...overrides
  }
}

describe('recommendation mentions on case pages', () => {
  it('puts About positions first, then the newest, and quotes each person about this case', () => {
    const mentions = findCaseMentions({
      project: 'editor',
      recommendations: [
        source({ slug: 'newest', date: '2026-10-11' }),
        source({ slug: 'second', featured: 2 }),
        source({ slug: 'older', date: '2026-08-01' }),
        source({ slug: 'first', featured: 1, mentions: [{ project: 'carts', quote: 'About carts.' }, { project: 'editor', quote: 'About the editor.' }] })
      ]
    })

    expect(mentions.map(mention => mention.slug)).toEqual(['first', 'second', 'newest', 'older'])
    expect(mentions[0]?.quote).toBe('About the editor.')
  })

  it('leaves out drafts and recommendations that do not mention the case', () => {
    const mentions = findCaseMentions({
      project: 'editor',
      recommendations: [
        source({ slug: 'draft', published: false }),
        source({ slug: 'elsewhere', mentions: [{ project: 'carts', quote: 'About carts.' }] }),
        source({ slug: 'kept' })
      ]
    })

    expect(mentions).toEqual([{ slug: 'kept', name: 'kept', quote: 'kept on the editor.' }])
    expect(findCaseMentions({ project: 'editor', recommendations: [] })).toEqual([])
  })
})
