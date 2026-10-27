import { defineCollection, defineContentConfig } from '@nuxt/content'
import { postSchema, projectSchema, recommendationSchema } from './shared/content-schema'
import { readContentInventory } from './scripts/lib/content'

/** Exclusion happens before SQLite generation: filtering only UI queries would still ship drafts in the client database. */
const { excluded } = readContentInventory()

export default defineContentConfig({
  collections: {
    projects: defineCollection({ type: 'page', source: { include: '*/projects/*.md', exclude: excluded }, schema: projectSchema }),
    posts: defineCollection({ type: 'page', source: { include: '*/posts/*.md', exclude: excluded }, schema: postSchema }),
    /** One file per person, shared by both languages: the text stays in the language it was written in. */
    recommendations: defineCollection({ type: 'page', source: { include: 'recommendations/*.md', exclude: excluded }, schema: recommendationSchema })
  }
})
