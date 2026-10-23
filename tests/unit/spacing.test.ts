import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Raw lengths that are drawing geometry rather than spacing, each tied to its rule.
 * Anything else in a padding, margin or gap must come from the spacing tokens.
 */
const GEOMETRY_EXCEPTIONS = [
  '.theme-switch: 3px',
  '.site-sidebar: 35px',
  '.wordmark: 53px',
  '.profile-actions: -34px'
]

/** Removes token references and calc() expressions, which mix tokens with fixed component sizes. */
function stripTokenExpressions(value: string) {
  let previous = ''
  let current = value
  while (current !== previous) {
    previous = current
    current = current.replace(/(?:var|env|calc)\([^()]*\)/g, '')
  }

  return current
}

/** Lists every raw length in a spacing declaration as "selector: value". */
function findRawSpacing(stylesheet: string) {
  const rules = stylesheet.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(?<selector>[^{}]+)\{(?<body>[^{}]*)\}/g)
  const found: string[] = []

  for (const rule of rules) {
    const selector = rule.groups?.selector?.trim() ?? ''
    for (const declaration of (rule.groups?.body ?? '').matchAll(/(?:^|;)\s*(?:padding|margin|gap|row-gap|column-gap)[\w-]*\s*:\s*(?<value>[^;]+)/g)) {
      const rawLengths = stripTokenExpressions(declaration.groups?.value ?? '').match(/-?\d*\.?\d+px/g) ?? []
      found.push(...rawLengths.map(length => `${selector.split(',')[0]?.trim()}: ${length}`))
    }
  }

  return found
}

describe('spacing standard', () => {
  it('builds every padding, margin and gap from the spacing tokens', () => {
    const stylesheet = readFileSync('app/assets/css/main.css', 'utf8')
    expect(findRawSpacing(stylesheet)).toEqual(GEOMETRY_EXCEPTIONS)
  })

  it('reports a raw length so a new rule cannot bypass the scale', () => {
    expect(findRawSpacing('.card { padding: 18px var(--space-4); gap: calc(var(--space-2) + 3px); }')).toEqual(['.card: 18px'])
  })
})
