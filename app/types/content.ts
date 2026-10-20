import type { Collections } from '@nuxt/content'

/** List cards receive the metadata they display, never a full Markdown document body. */
export type ProjectSummary = Pick<Collections['projects'], 'locale' | 'slug' | 'title' | 'description' | 'category' | 'year' | 'stack' | 'results'>

/** Article preview metadata shared by the home page and blog listings. */
export type PostSummary = Pick<Collections['posts'], 'slug' | 'title' | 'description' | 'category' | 'date' | 'readingMinutes' | 'cover' | 'coverAlt' | 'tags'>
