import { describe, expect, it } from 'vitest'
import { getLinkNavigation } from '../../app/utils/links'

const siteUrl = 'https://anu3ev.com'
/** Expected native contexts are independent of URL parsing and renderer details. */
const separateTab = { target: '_blank', rel: 'noopener noreferrer' }
const currentTab = { target: undefined, rel: undefined }

describe('external navigation policy', () => {
  it('opens third-party HTTP, HTTPS and protocol-relative destinations separately', () => {
    expect(getLinkNavigation({ href: 'https://github.com/Anu3ev', siteUrl })).toEqual(separateTab)
    expect(getLinkNavigation({ href: 'http://example.org/project', siteUrl })).toEqual(separateTab)
    expect(getLinkNavigation({ href: '//example.org/project', siteUrl })).toEqual(separateTab)
  })

  it('keeps absolute same-site routes, relative paths and anchors in their context', () => {
    expect(getLinkNavigation({ href: 'https://anu3ev.com/work/?topic=editors#cases', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: '/work/', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: '../work/', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: '#on-this-page', siteUrl })).toEqual(currentTab)
  })

  it('leaves email and other non-web schemes to their existing handling', () => {
    expect(getLinkNavigation({ href: 'mailto:owner@example.org', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: 'tel:+123456789', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: 'javascript:alert(1)', siteUrl })).toEqual(currentTab)
  })

  it('compares actual origins rather than host substrings or explicit default ports', () => {
    expect(getLinkNavigation({ href: 'https://anu3ev.com:443/work/', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: 'https://anu3ev.com:8443/work/', siteUrl })).toEqual(separateTab)
    expect(getLinkNavigation({ href: 'https://anu3ev.com.example.org/', siteUrl })).toEqual(separateTab)
  })

  it('does not throw while classifying malformed editorial links', () => {
    expect(getLinkNavigation({ href: 'https://', siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: 'http://[invalid', siteUrl })).toEqual(currentTab)
  })

  it('preserves authored targets and metadata on internal navigation', () => {
    expect(getLinkNavigation({ href: '/work/', siteUrl, target: '_self', rel: 'author' }))
      .toEqual({ target: '_self', rel: 'author' })
    expect(getLinkNavigation({ href: '/work/', siteUrl, target: '_blank', rel: 'nofollow' }))
      .toEqual({ target: '_blank', rel: 'nofollow noopener noreferrer' })
  })

  it('protects external navigation while retaining authored relationship tokens', () => {
    expect(getLinkNavigation({ href: 'https://example.org/', siteUrl, target: '_self' })).toEqual(separateTab)
    expect(getLinkNavigation({ href: 'https://example.org/', siteUrl, rel: 'ugc nofollow' }))
      .toEqual({ target: '_blank', rel: 'ugc nofollow noopener noreferrer' })
  })

  it('does not force a new context for a missing or empty destination', () => {
    expect(getLinkNavigation({ siteUrl })).toEqual(currentTab)
    expect(getLinkNavigation({ href: '', siteUrl })).toEqual(currentTab)
  })
})
