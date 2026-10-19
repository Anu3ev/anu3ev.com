import { defineCollection, defineContentConfig, z } from '@nuxt/content'

/** Fields shared by published documents; slugs remain stable across languages. */
const editorialFields = {
  locale: z.enum(['en', 'ru']),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  published: z.boolean().default(false),
  cover: z.string(),
  coverAlt: z.string(),
  category: z.string()
}

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: '*/projects/*.md',
      schema: z.object({
        ...editorialFields,
        year: z.string(),
        role: z.string(),
        stack: z.array(z.string()),
        featured: z.boolean().default(false),
        order: z.number(),
        repository: z.string().url().optional(),
        demo: z.string().url().optional()
      })
    }),
    posts: defineCollection({
      type: 'page',
      source: '*/posts/*.md',
      schema: z.object({
        ...editorialFields,
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        readingMinutes: z.number().int().positive(),
        tags: z.array(z.string())
      })
    }),
    profile: defineCollection({
      type: 'data',
      source: 'settings/profile.json',
      schema: z.object({
        name: z.string(),
        email: z.string().email(),
        github: z.string().url(),
        linkedin: z.string().url(),
        telegram: z.string().url(),
        location: z.string(),
        available: z.boolean(),
        headline_en: z.string(),
        headline_ru: z.string(),
        bio_en: z.string(),
        bio_ru: z.string()
      })
    })
  }
})
