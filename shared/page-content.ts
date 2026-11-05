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
  home: z.strictObject({ seoTitle: heading, pinnedTitle: heading, pinnedBody: paragraph, highlights: z.array(editorialFact).min(1).max(4) }),
  about: z.strictObject({
    title: heading, intro: paragraph, body: paragraph, story: paragraph, technologies: tags,
    experienceTitle: heading, experience: z.array(careerJob).max(20),
    principles: z.array(z.strictObject({ title: heading, description: paragraph })).min(1).max(6)
  }),
  portfolio: z.strictObject({ title: heading, intro: paragraph }),
  blog: z.strictObject({ title: heading, intro: paragraph }),
  contact: z.strictObject({ title: heading, intro: paragraph, note: paragraph, arrangements: tags }),
  collaboration: z.strictObject({ title: heading, body: paragraph }),
  cta: z.strictObject({ title: heading, body: paragraph }),
  privacy: z.strictObject({ title: heading, updated: z.iso.date(), body: paragraph, contact: paragraph, storage: paragraph })
})

/** Static editorial settings have the same complete contract in both languages. */
export const sitePagesSchema = z.strictObject({ en: localizedPages, ru: localizedPages })
export type SitePages = z.input<typeof sitePagesSchema>

/** Shows a `YYYY-MM` month as "Oct 2021" or "окт. 2021": the site's one style for months. */
export function formatMonth({ value, locale }: { value: string, locale: 'en' | 'ru' }) {
  const date = new Date(`${month.parse(value)}-01T00:00:00Z`)
  const label = new Intl.DateTimeFormat(locale === 'ru' ? 'ru' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
  return label.replace(/\s*г\.$/, '')
}

/** Shows a `YYYY-MM-DD` date as "21 Oct 2026" or "21 окт. 2026", in the same style as months. */
export function formatDay({ value, locale }: { value: string, locale: 'en' | 'ru' }) {
  return `${Number(value.slice(8, 10))} ${formatMonth({ value: value.slice(0, 7), locale })}`
}

/** Month-only career dates have no timezone conversion; an empty end represents an ongoing role. */
export function formatExperiencePeriod({ start, end, presentLabel, locale }: { start: string, end?: string, presentLabel: string, locale: 'en' | 'ru' }) {
  const period = careerPeriod.parse({ start, end })
  if (!presentLabel.trim()) throw new Error('A present-period label is required')
  const to = period.end ? formatMonth({ value: period.end, locale }) : presentLabel
  return `${formatMonth({ value: period.start, locale })} – ${to}`
}
