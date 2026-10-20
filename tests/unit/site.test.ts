import { describe, expect, it } from 'vitest'
import { DEFAULT_SITE_ORIGIN, getSiteOrigin } from '../../shared/site'

describe('public canonical origin', () => {
  it('uses the actual publication host by default and normalizes a trailing slash', () => {
    expect(getSiteOrigin()).toBe(DEFAULT_SITE_ORIGIN)
    expect(getSiteOrigin('https://portfolio.example.test/')).toBe('https://portfolio.example.test')
  })

  it('rejects insecure, malformed and credential-bearing origins', () => {
    for (const url of ['not-a-url', 'http://example.test', 'https://user:password@example.test']) {
      expect(() => getSiteOrigin(url)).toThrow()
    }
  })

  it('rejects a base path, query or hash rather than silently generating incorrect routes', () => {
    for (const url of ['https://example.test/portfolio', 'https://example.test?preview=true', 'https://example.test#top']) {
      expect(() => getSiteOrigin(url)).toThrow('must be an origin')
    }
  })
})
