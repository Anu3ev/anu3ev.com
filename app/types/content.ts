import type { Collections } from '@nuxt/content'

/** List cards receive the metadata they display, never a full Markdown document body. */
export type ProjectSummary = Pick<Collections['projects'], 'slug' | 'title' | 'description' | 'category' | 'year' | 'cover' | 'coverAlt' | 'stack'>

/** Article preview metadata shared by the home page and blog listings. */
export type PostSummary = Pick<Collections['posts'], 'slug' | 'title' | 'description' | 'category' | 'date' | 'readingMinutes' | 'cover' | 'coverAlt' | 'tags'>
