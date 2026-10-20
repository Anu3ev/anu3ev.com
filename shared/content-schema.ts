import { z } from 'zod'

/** Stable slugs avoid framework route names and map one-to-one to Markdown filenames. */
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine(slug => !['page', 'index', 'admin'].includes(slug), 'This slug is reserved')

/** External project links must remain ordinary HTTPS navigation destinations. */
const optionalLink = z.union([z.string().url().regex(/^https:\/\//), z.literal('')]).optional()
const publicImage = z.string().regex(/^\/images\/[^?#]+\.(?:webp|png|jpe?g|svg)$/i)

/** Shared content boundary for both Nuxt's collections and the command-line publishing checks. */
const editorialSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(280),
  locale: z.enum(['en', 'ru']),
  slug: slugSchema,
  published: z.boolean().default(false),
  cover: publicImage,
  coverAlt: z.string().min(8).max(220),
  category: z.string().min(2).max(60)
})

/** A case describes ownership and evidence; an external demo never loads inside the global layout. */
export const projectSchema = editorialSchema.extend({
  year: z.string().min(4).max(40),
  role: z.string().min(5).max(120),
  stack: z.array(z.string().min(1)).min(1).max(12),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(999),
  repository: optionalLink,
  demo: optionalLink
})

/** Calendar dates and reading time are explicit editorial inputs, checked before publishing. */
export const postSchema = editorialSchema.extend({
  date: z.iso.date(),
  readingMinutes: z.number().int().min(1).max(60),
  tags: z.array(z.string().min(1)).min(1).max(10)
})

/** Public profile fields edited through the CMS; no credentials belong in this document. */
export const profileSchema = z.object({
  name: z.string().min(3),
  name_ru: z.string().min(3),
  photo: publicImage,
  /** Square crop shown at 44–86 px; the larger portrait stays in `photo`. */
  avatar: publicImage,
  email: z.string().email(),
  github: z.string().url().regex(/^https:\/\//),
  linkedin: z.string().url().regex(/^https:\/\//),
  telegram: z.string().url().regex(/^https:\/\//),
  location: z.string().min(3),
  available: z.boolean(),
  headline_en: z.string().min(5),
  headline_ru: z.string().min(5),
  bio_en: z.string().min(20),
  bio_ru: z.string().min(20)
})
