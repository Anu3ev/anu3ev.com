import { describe, expect, it } from 'vitest'
import { paginate } from '../../app/utils/pagination'

describe('blog pagination', () => {
  it.each([
    { total: 0, pages: 1, firstPage: 0 },
    { total: 1, pages: 1, firstPage: 1 },
    { total: 10, pages: 1, firstPage: 10 },
    { total: 11, pages: 2, firstPage: 10 },
    { total: 20, pages: 2, firstPage: 10 },
    { total: 21, pages: 3, firstPage: 10 }
  ])('shows at most 10 articles for $total published articles', ({ total, pages, firstPage }) => {
    const items = Array.from({ length: total }, (_, index) => index)
    const result = paginate({ items, page: 1 })

    expect(result.items).toHaveLength(firstPage)
    expect(result.pageCount).toBe(pages)
    expect(result.total).toBe(total)
  })

  it('keeps the last article on a third page without repeating articles or mutating the source', () => {
    const items = Array.from({ length: 21 }, (_, index) => index)
    const first = paginate({ items, page: 1 })
    const second = paginate({ items, page: 2 })
    const third = paginate({ items, page: 3 })

    expect(third.items).toEqual([20])
    expect([...first.items, ...second.items, ...third.items]).toEqual(items)
    expect(items).toHaveLength(21)
  })

  it('rejects missing pages and malformed numbers instead of serving duplicate content', () => {
    for (const page of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => paginate({ items: [], page })).toThrow(RangeError)
    }

    expect(() => paginate({ items: [1], page: 2 })).toThrow('Page does not exist')
    expect(() => paginate({ items: [1], page: 1, pageSize: 0 })).toThrow(RangeError)
    expect(() => paginate({ items: [1], page: 1, pageSize: 101 })).toThrow(RangeError)
  })
})
