import { describe, expect, it } from 'vitest'
import { getReleaseTag } from '../../scripts/lib/releases'

describe('versioned release boundary', () => {
  it('does not create another release for a content-only update', () => {
    expect(getReleaseTag({ version: '1.0.0', previousVersion: '1.0.0' })).toBe('')
  })

  it('accepts increasing patch, minor and major versions using numeric order', () => {
    expect(getReleaseTag({ version: '1.0.10', previousVersion: '1.0.9' })).toBe('v1.0.10')
    expect(getReleaseTag({ version: '1.10.0', previousVersion: '1.9.99' })).toBe('v1.10.0')
    expect(getReleaseTag({ version: '2.0.0', previousVersion: '1.99.99' })).toBe('v2.0.0')
  })

  it('rejects downgrades rather than retagging old releases', () => {
    expect(() => getReleaseTag({ version: '1.0.9', previousVersion: '1.0.10' })).toThrow('must increase')
  })

  it('rejects malformed, prerelease and multiline values before they reach workflow output', () => {
    for (const version of ['v1.0.0', '01.0.0', '1.0', '1.0.1-beta.1', '1.0.1\ntag=other', '1.0.1\n']) {
      expect(() => getReleaseTag({ version, previousVersion: '1.0.0' })).toThrow('stable major.minor.patch')
    }
    expect(() => getReleaseTag({ version: '1.0.0', previousVersion: 'invalid' })).toThrow('stable major.minor.patch')
  })
})
