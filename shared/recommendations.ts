/** The recommendation fields a case page needs to show who mentions it. */
export interface MentionSource {
  slug: string
  name: string
  date: string
  featured?: number
  published: boolean
  mentions: readonly { project: string, quote: string }[]
}

/** One person who mentions a case, with the sentence they wrote about it. */
export interface CaseMention {
  slug: string
  name: string
  quote: string
}

/**
 * Everyone whose published recommendation mentions the case, in the order the case page shows them:
 * About positions first (1, 2, 3), then the newest. The first entry's sentence is the one quoted.
 */
export function findCaseMentions({ recommendations, project }: { recommendations: readonly MentionSource[], project: string }): CaseMention[] {
  return recommendations
    .filter(recommendation => recommendation.published)
    .flatMap((recommendation) => {
      const mention = recommendation.mentions.find(item => item.project === project)
      return mention ? [{ recommendation, quote: mention.quote }] : []
    })
    .sort((first, second) =>
      (first.recommendation.featured ?? Infinity) - (second.recommendation.featured ?? Infinity)
      || second.recommendation.date.localeCompare(first.recommendation.date))
    .map(({ recommendation, quote }) => ({ slug: recommendation.slug, name: recommendation.name, quote }))
}
