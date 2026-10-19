import { queryCollection } from '#imports'
import { getPublicationDate } from '~~/shared/publication'

/** Published card metadata in one editorial order; Home caps its payload while Blog can filter the full index. */
export function getPostSummaries({ locale, limit }: { locale: 'en' | 'ru', limit?: number }) {
  const query = queryCollection('posts')
    .where('locale', '=', locale)
    .where('published', '=', true)
    .where('date', '<=', getPublicationDate())
    .order('date', 'DESC')
    .order('slug', 'DESC')
    .select('slug', 'title', 'description', 'category', 'date', 'readingMinutes', 'cover', 'coverAlt', 'tags')

  return limit === undefined ? query.all() : query.limit(limit).all()
}
