import type { z } from 'zod'
import type { certificatesSchema, postSchema, profileSchema, projectSchema, recommendationSchema } from '../../shared/content-schema'
import type { sitePagesSchema } from '../../shared/page-content'
import { canonicalPagePath } from '../../shared/seo'

type Locale = 'en' | 'ru'
type Project = z.output<typeof projectSchema>
type Post = z.output<typeof postSchema>
type Profile = z.output<typeof profileSchema>
type Pages = z.output<typeof sitePagesSchema>
type Certificate = z.output<typeof certificatesSchema>['certificates'][number]
type Recommendation = z.output<typeof recommendationSchema>

/** A published recommendation: one text for both languages, addressed by its filename slug. */
interface PublicRecommendation {
  slug: string
  metadata: Recommendation
  body: string
}

/** A published case or article with the Markdown body it was written in. */
interface PublicDocument<Metadata> {
  metadata: Metadata
  body: string
}

/** Fixed labels of the generated files; the facts themselves come from the content and settings. */
const LABELS = {
  en: {
    summary: 'Senior frontend engineer', location: 'Location', availability: 'Availability', available: 'Open to new roles',
    contact: 'Contact', cv: 'CV (PDF)', call: 'Book a call', cases: 'Case studies', articles: 'Articles', certificates: 'Certificates',
    pages: 'Pages', about: 'About', contactPage: 'Contacts', optional: 'Optional', fullText: 'Full text of every case and article',
    otherLanguage: 'Russian version', url: 'URL', period: 'Period', context: 'Where', role: 'Role', skills: 'Skills', results: 'Results',
    published: 'Published', topic: 'Topic', readingTime: 'Reading time', minutes: 'min',
    recommendations: 'Recommendations', recommendationFrom: 'Recommendation from', author: 'Author', relationship: 'Relationship',
    written: 'Written', original: 'Original on LinkedIn'
  },
  ru: {
    summary: 'Senior frontend-разработчик', location: 'Где', availability: 'Работа', available: 'Открыт к предложениям',
    contact: 'Контакты', cv: 'Резюме (PDF)', call: 'Созвониться', cases: 'Кейсы', articles: 'Статьи', certificates: 'Сертификаты',
    pages: 'Страницы', about: 'Обо мне', contactPage: 'Контакты', optional: 'Optional', fullText: 'Полный текст всех кейсов и статей',
    otherLanguage: 'English version', url: 'Адрес', period: 'Период', context: 'Где', role: 'Роль', skills: 'Навыки', results: 'Результаты',
    published: 'Опубликовано', topic: 'Тема', readingTime: 'Время чтения', minutes: 'мин',
    recommendations: 'Рекомендации', recommendationFrom: 'Рекомендация от', author: 'Автор', relationship: 'Как работали',
    written: 'Написана', original: 'Оригинал в LinkedIn'
  }
} as const satisfies Record<Locale, Record<string, string>>

/** LinkedIn's relationship line, in the third person: these files describe the owner rather than speak for him. */
const RELATIONSHIPS = {
  en: {
    'managed-directly': 'managed Alexander directly', 'senior': 'senior to Alexander, not his manager',
    'same-team': 'worked with Alexander on the same team', 'teacher': 'Alexander’s teacher'
  },
  ru: {
    'managed-directly': 'непосредственный руководитель Александра', 'senior': 'старший коллега, не руководитель Александра',
    'same-team': 'работали с Александром в одной команде', 'teacher': 'преподаватель Александра'
  }
} as const satisfies Record<Locale, Record<Recommendation['relationship'], string>>

/** The site serves each page's Markdown copy next to it, as `…/index.md`. */
export function markdownPath(pagePath: string) {
  return `${canonicalPagePath(pagePath)}index.md`
}

/** Root-relative links and images become absolute, so a tool reading the file alone can follow them. */
function absolutizeLinks({ markdown, origin }: { markdown: string, origin: string }) {
  return markdown.replace(/(\]\()\/(?!\/)/g, `$1${origin}/`)
}

/** One case study as a self-contained Markdown document: its facts first, then the case text. */
export function createProjectMarkdown({ project, origin }: { project: PublicDocument<Project>, origin: string }) {
  const { metadata, body } = project
  const labels = LABELS[metadata.locale]
  const prefix = metadata.locale === 'ru' ? '/ru' : ''
  const results = metadata.results.map(result => `  - ${result.value}: ${result.label}`)
  const facts = [
    `- ${labels.url}: ${origin}${canonicalPagePath(`${prefix}/work/${metadata.slug}`)}`,
    `- ${labels.period}: ${metadata.year}`,
    `- ${labels.context}: ${metadata.context}`,
    `- ${labels.role}: ${metadata.role}`,
    `- ${labels.skills}: ${metadata.stack.join(', ')}`,
    ...(results.length ? [`- ${labels.results}:`, ...results] : [])
  ]

  return `# ${metadata.title}\n\n> ${metadata.description}\n\n${facts.join('\n')}\n\n${absolutizeLinks({ markdown: body.trim(), origin })}\n`
}

/** One article as a self-contained Markdown document: its facts first, then the article text. */
export function createPostMarkdown({ post, origin }: { post: PublicDocument<Post>, origin: string }) {
  const { metadata, body } = post
  const labels = LABELS[metadata.locale]
  const prefix = metadata.locale === 'ru' ? '/ru' : ''
  const facts = [
    `- ${labels.url}: ${origin}${canonicalPagePath(`${prefix}/blog/${metadata.slug}`)}`,
    `- ${labels.published}: ${metadata.date}`,
    `- ${labels.topic}: ${metadata.category}`,
    `- ${labels.readingTime}: ${metadata.readingMinutes} ${labels.minutes}`
  ]

  return `# ${metadata.title}\n\n> ${metadata.description}\n\n${facts.join('\n')}\n\n${absolutizeLinks({ markdown: body.trim(), origin })}\n`
}

/**
 * The `/llms.txt` index for one language (llmstxt.org format): who the owner is, how to reach him,
 * and every published case, article and recommendation with a link to its Markdown copy.
 */
export function createLlmsIndex({ locale, origin, profile, pages, projects, posts, certificates, recommendations }: {
  locale: Locale
  origin: string
  profile: Profile
  pages: Pages
  projects: readonly Project[]
  posts: readonly Post[]
  certificates: readonly Certificate[]
  recommendations: readonly Omit<PublicRecommendation, 'body'>[]
}) {
  const labels = LABELS[locale]
  const prefix = locale === 'ru' ? '/ru' : ''
  const name = locale === 'ru' ? profile.name_ru : profile.name
  const location = locale === 'ru' ? profile.location_ru : profile.location
  const arrangements = pages[locale].contact.arrangements.join(', ')
  const caseLinks = projects.map(project => `- [${project.title}](${origin}${markdownPath(`${prefix}/work/${project.slug}`)}): ${project.description}`)
  const articleLinks = posts.map(post => `- [${post.title}](${origin}${markdownPath(`${prefix}/blog/${post.slug}`)}): ${post.description}`)
  const recommendationLinks = recommendations.map(({ slug, metadata }) => `- [${labels.recommendationFrom} ${metadata.name}](${origin}${markdownPath(`${prefix}/recommendations/${slug}`)}): ${metadata.highlight}`)
  const certificateLines = certificates.map(certificate => `- ${certificate.name}, ${certificate.issuer}, ${certificate.issued}`)
  const otherPrefix = locale === 'ru' ? '' : '/ru'
  // The bio keeps its paragraph break on the page; the llms.txt summary must stay one blockquote line.
  const summary = profile[`bio_${locale}`].replace(/\s*\n\s*/g, ' ')

  return `# ${name}

> ${labels.summary}. ${summary}

- ${labels.location}: ${location}
- ${labels.availability}: ${profile.available ? `${labels.available}; ` : ''}${arrangements}
- ${labels.contact}: ${profile.email} · LinkedIn ${profile.linkedin} · GitHub ${profile.github} · Telegram ${profile.telegram}
- ${labels.cv}: ${origin}${profile[`cv_${locale}`]}
- ${labels.call}: ${profile.calendly}

## ${labels.cases}

${caseLinks.join('\n')}

## ${labels.articles}

${articleLinks.join('\n')}

## ${labels.recommendations}

${recommendationLinks.join('\n')}

## ${labels.certificates}

${certificateLines.join('\n')}

## ${labels.pages}

- [${labels.about}](${origin}${canonicalPagePath(`${prefix}/about`)})
- [${labels.recommendations}](${origin}${canonicalPagePath(`${prefix}/recommendations`)})
- [${labels.contactPage}](${origin}${canonicalPagePath(`${prefix}/contact`)})

## ${labels.optional}

- [${labels.fullText}](${origin}${prefix}/llms-full.txt)
- [${labels.otherLanguage}](${origin}${otherPrefix}/llms.txt)
`
}

/**
 * One recommendation as a self-contained Markdown document for a language's page: who wrote it and how they
 * know the owner first, then their text in the original English.
 */
export function createRecommendationMarkdown({ recommendation, locale, origin, sourceUrl }: {
  recommendation: PublicRecommendation
  locale: Locale
  origin: string
  sourceUrl: string
}) {
  const { slug, metadata, body } = recommendation
  const labels = LABELS[locale]
  const prefix = locale === 'ru' ? '/ru' : ''
  const facts = [
    `- ${labels.url}: ${origin}${canonicalPagePath(`${prefix}/recommendations/${slug}`)}`,
    `- ${labels.author}: ${metadata.name}, ${metadata[`headline_${locale}`]} (${metadata.profile})`,
    `- ${labels.relationship}: ${RELATIONSHIPS[locale][metadata.relationship]}`,
    `- ${labels.written}: ${metadata.date}`,
    `- ${labels.original}: ${sourceUrl}`
  ]

  return `# ${labels.recommendationFrom} ${metadata.name}\n\n> ${metadata.highlight}\n\n${facts.join('\n')}\n\n${body.trim()}\n`
}
