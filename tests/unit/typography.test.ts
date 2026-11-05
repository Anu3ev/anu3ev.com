import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatDay, formatExperiencePeriod, formatMonth } from '../../shared/page-content'
import { typeset, typesetMarkdownNodes, typesetSettings } from '../../shared/typography'

const WORD_JOINER = '\u2060'
const NO_BREAK_SPACE = '\u00A0'
const css = readFileSync('app/assets/css/main.css', 'utf8')

/** Selectors allowed to set their own size: initials inside avatar circles and inline code. */
const SIZE_EXCEPTIONS = ['.person-initials', '.case-mentions-faces .person-initials', '.recommendation-card-author .person-initials', '.prose code']

/** Every `selector { font-size: value }` whose value is not a type token. */
function findRawFontSizes(source: string) {
  const rules = source.matchAll(/(?<selector>[^{}]+)\{(?<body>[^{}]*)\}/g)
  return [...rules].flatMap((rule) => {
    const selector = (rule.groups?.selector ?? '').replace(/\/\*[\s\S]*?\*\//g, '').trim()
    const size = rule.groups?.body?.match(/(?:^|;|\s)font-size:\s*(?<value>[^;}]+)/)?.groups?.value?.trim()
    if (!size || size.startsWith('var(--text-') || SIZE_EXCEPTIONS.includes(selector)) return []
    return [`${selector}: ${size}`]
  })
}

/** Every font weight the stylesheet declares. */
function findWeights(source: string) {
  return [...new Set([...source.matchAll(/font-weight:\s*(?<weight>\d+)/g)].map(match => match.groups?.weight))]
}

describe('type standard', () => {
  it('takes every font size from the type tokens', () => {
    expect(findRawFontSizes(css)).toEqual([])
    expect(findRawFontSizes('.card { font-size: 13px; }')).toEqual(['.card: 13px'])
  })

  it('uses two font weights', () => {
    expect(findWeights(css).sort()).toEqual(['400', '600'])
    expect(findWeights('.a { font-weight: 550; }')).toEqual(['550'])
  })
})

describe('line breaks', () => {
  it('keeps ranges and large numbers whole in both languages', () => {
    expect(typeset({ text: 'instead of 5–10 min', locale: 'en' })).toBe(`instead of 5${WORD_JOINER}–${WORD_JOINER}10 min`)
    expect(typeset({ text: 'работают 60 000 клиентов', locale: 'ru' })).toBe(`работают 60${NO_BREAK_SPACE}000 клиентов`)
  })

  it('binds short Russian words and hyphenated compounds, and leaves English words alone', () => {
    expect(typeset({ text: 'на Vue и в онлайн-бизнесе', locale: 'ru' })).toBe(`на${NO_BREAK_SPACE}Vue и${NO_BREAK_SPACE}в${NO_BREAK_SPACE}онлайн${WORD_JOINER}-${WORD_JOINER}бизнесе`)
    expect(typeset({ text: 'a well-made tool', locale: 'en' })).toBe('a well-made tool')
    expect(typeset({ text: 'form-protection', locale: 'ru' })).toBe('form-protection')
  })

  it('typesets settings values and keeps their shape', () => {
    expect(typesetSettings({ settings: { list: [{ label: 'от 5–10 мин' }] }, locale: 'ru' }))
      .toEqual({ list: [{ label: `от${NO_BREAK_SPACE}5${WORD_JOINER}–${WORD_JOINER}10 мин` }] })
  })

  it('typesets Markdown text at any depth and skips code', () => {
    const nodes: unknown[] = [['p', {}, 'на Vue', ['strong', {}, 'и код'], ['code', {}, 'на Vue']], ['pre', {}, ['code', {}, 'и код']]]
    typesetMarkdownNodes({ nodes, locale: 'ru' })

    expect(nodes).toEqual([
      ['p', {}, `на${NO_BREAK_SPACE}Vue`, ['strong', {}, `и${NO_BREAK_SPACE}код`], ['code', {}, 'на Vue']],
      ['pre', {}, ['code', {}, 'и код']]
    ])
  })
})

describe('dates', () => {
  it('shows months and days in one style per language', () => {
    expect(formatMonth({ value: '2026-09', locale: 'en' })).toBe('Sep 2026')
    expect(formatMonth({ value: '2026-10', locale: 'ru' })).toBe('окт. 2026')
    expect(formatDay({ value: '2026-10-21', locale: 'en' })).toBe('21 Oct 2026')
    expect(formatDay({ value: '2026-10-01', locale: 'ru' })).toBe('1 окт. 2026')
  })

  it('joins a career period with an en dash', () => {
    expect(formatExperiencePeriod({ start: '2021-10', end: '2026-09', presentLabel: 'Present', locale: 'en' })).toBe('Oct 2021 – Sep 2026')
    expect(formatExperiencePeriod({ start: '2026-10', presentLabel: 'Сейчас', locale: 'ru' })).toBe('окт. 2026 – Сейчас')
    expect(() => formatExperiencePeriod({ start: '2026-10', presentLabel: ' ', locale: 'en' })).toThrow()
  })
})

describe('article diagrams', () => {
  /** Every SVG under a directory, walked with a plain stack. */
  function findSvgFiles(root: string) {
    const directories = [root]
    const files: string[] = []
    for (let directory = directories.pop(); directory; directory = directories.pop()) {
      for (const name of readdirSync(directory)) {
        const path = join(directory, name)
        if (statSync(path).isDirectory()) directories.push(path)
        else if (name.endsWith('.svg')) files.push(path)
      }
    }
    return files
  }

  it('carry Inter inside the file, because an image cannot use the page fonts', () => {
    const diagrams = findSvgFiles('public/images').filter(path => readFileSync(path, 'utf8').includes('<text'))

    expect(diagrams.length).toBeGreaterThan(0)
    expect(diagrams.filter(path => !readFileSync(path, 'utf8').includes('@font-face'))).toEqual([])
  })
})
