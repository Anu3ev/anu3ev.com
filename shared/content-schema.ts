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
  /** Where the work was done, shown next to the period on cards: an employer or "Open source". */
  context: z.string().min(2).max(40),
  role: z.string().min(5).max(120),
  /** Skills in the owner's LinkedIn order; LinkedIn allows 20 per project and cards show the first three. */
  stack: z.array(z.string().min(1)).min(1).max(20),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(999),
  repository: optionalLink,
  demo: optionalLink,
  /** Headline numbers in presentation style; each one must come from a verified source, with its base and scope in the label. */
  results: z.array(z.strictObject({ value: z.string().min(1).max(24), label: z.string().min(3).max(110) })).max(4).default([])
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
  location_ru: z.string().min(3),
  available: z.boolean(),
  headline_en: z.string().min(5),
  headline_ru: z.string().min(5),
  bio_en: z.string().min(20),
  bio_ru: z.string().min(20)
})

/** Issue month without a day: certificates and LinkedIn record only the month. */
const issueMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)
const optionalText = z.string().max(220).optional().default('')

/**
 * One certificate as the owner lists it on LinkedIn. Names stay in the issuer's wording in both languages.
 * A featured certificate is shown as a card, so it must bring its preview, alt text and summaries.
 */
const certificateSchema = z.strictObject({
  name: z.string().min(3).max(120),
  issuer: z.string().min(2).max(60),
  issued: issueMonth,
  category: z.enum(['course', 'test', 'lessons']),
  /** Skills in the owner's LinkedIn order; cards show the first three. */
  skills: z.array(z.string().min(1).max(40)).min(1).max(20),
  credentialId: z.string().max(100).optional().default(''),
  /**
   * Where a reader can see the certificate: the issuer's verification page, or a full-size copy under
   * /images/ when the issuer has no public page. Empty when neither exists.
   */
  url: z.union([optionalLink, publicImage]).optional().default(''),
  featured: z.boolean(),
  image: z.union([publicImage, z.literal('')]).optional().default(''),
  imageAlt_en: optionalText,
  imageAlt_ru: optionalText,
  summary_en: optionalText,
  summary_ru: optionalText
}).refine(
  certificate => !certificate.featured || [certificate.image, certificate.imageAlt_en, certificate.imageAlt_ru, certificate.summary_en, certificate.summary_ru].every(Boolean),
  'A featured certificate needs an image, alt text and a summary in both languages'
)

/** Certificates edited through the CMS, in display order. */
export const certificatesSchema = z.strictObject({ certificates: z.array(certificateSchema).max(30) })
