import { z } from 'zod'

const heading = z.string().min(4).max(120)
const paragraph = z.string().min(20).max(1600)
const tags = z.array(z.string().min(1).max(60)).min(1).max(20)
const month = z.string().length(7).regex(/^\d{4}-(0[1-9]|1[0-2])$/)
const careerPeriod = z.object({ start: month, end: z.union([month, z.literal('')]).optional().default('') })
  .refine(period => !period.end || period.end >= period.start, 'Career end must not precede its start')
const careerJob = careerPeriod.safeExtend({
  company: z.string().min(2).max(100),
  role: heading,
  description: paragraph
})

/** Short value + label facts (home proof points, portfolio introduction) are edited content, not hardcoded markup. */
const editorialFact = z.strictObject({ value: z.string().min(1).max(60), label: z.string().min(1).max(90) })

const localizedPages = z.strictObject({
  home: z.strictObject({ seoTitle: heading, pinnedTitle: heading, pinnedBody: paragraph, tags, highlights: z.array(editorialFact).min(1).max(4) }),
  about: z.strictObject({
    title: heading, intro: paragraph, body: paragraph, story: paragraph, technologies: tags,
    experienceTitle: heading, experience: z.array(careerJob).max(20),
    principles: z.array(z.strictObject({ title: heading, description: paragraph })).min(1).max(6)
  }),
  portfolio: z.strictObject({ title: heading, intro: paragraph, summary: z.array(editorialFact).min(1).max(4) }),
  blog: z.strictObject({ title: heading, intro: paragraph }),
  contact: z.strictObject({ title: heading, intro: paragraph, note: paragraph, arrangements: tags }),
  sidebar: z.strictObject({ bio: paragraph, focusTitle: heading, focusDetails: paragraph, focusTags: tags }),
  collaboration: z.strictObject({ title: heading, body: paragraph }),
  cta: z.strictObject({ title: heading, body: paragraph }),
  privacy: z.strictObject({ title: heading, updated: z.iso.date(), body: paragraph, contact: paragraph, storage: paragraph })
})

/** Static editorial settings have the same complete contract in both languages. */
export const sitePagesSchema = z.strictObject({ en: localizedPages, ru: localizedPages })
export type SitePages = z.input<typeof sitePagesSchema>

/** Shows a `YYYY-MM` month as `MM.YYYY`, the site's one date style for career periods and certificates. */
export function formatMonth(value: string) {
  return month.parse(value).replace(/^(\d{4})-(\d{2})$/, '$2.$1')
}

/** Month-only career dates have no timezone conversion; an empty end represents an ongoing role. */
export function formatExperiencePeriod({ start, end, presentLabel }: { start: string, end?: string, presentLabel: string }) {
  const period = careerPeriod.parse({ start, end })
  if (!presentLabel.trim()) throw new Error('A present-period label is required')
  const to = period.end ? formatMonth(period.end) : presentLabel
  return `${formatMonth(period.start)} — ${to}`
}
