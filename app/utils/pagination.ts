/** Maximum number of articles exposed on a single listing page. */
export const BLOG_PAGE_SIZE = 10

/** Rejects invalid external pagination inputs instead of silently returning duplicate or empty pages. */
export function paginate<T>({ items, page, pageSize = BLOG_PAGE_SIZE }: { items: readonly T[], page: number, pageSize?: number }) {
  if (!Number.isSafeInteger(page) || page < 1) throw new RangeError('Page must be a positive safe integer')
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new RangeError('Page size must be between 1 and 100')

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  if (page > pageCount) throw new RangeError('Page does not exist')

  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pageCount, total: items.length }
}
