const WORD_JOINER = '\u2060'
const NO_BREAK_SPACE = '\u00A0'

/**
 * Keeps text from breaking where a reader would stumble: inside number ranges and large numbers, and in Russian
 * after short words and at hyphens in compounds. Only rendered text goes through it; metadata and sources stay plain.
 */
export function typeset({ text, locale }: { text: string, locale: 'en' | 'ru' }) {
  const numbersKept = text
    .replace(/(\d)–(\d)/g, `$1${WORD_JOINER}–${WORD_JOINER}$2`)
    .replace(/(\d) (\d{3})/g, `$1${NO_BREAK_SPACE}$2`)
  if (locale !== 'ru') return numbersKept

  return numbersKept
    .replace(/(?<=^|[\s("«])(в|во|и|а|на|с|со|к|ко|о|об|у|по|из|за|до|от|не|но|для) (?=\S)/giu, `$1${NO_BREAK_SPACE}`)
    .replace(/(?<=[\p{L}\d])-(?=\p{Script=Cyrillic})|(?<=\p{Script=Cyrillic})-(?=[\p{L}\d])/gu, `${WORD_JOINER}-${WORD_JOINER}`)
}

/** Typesets every string of a settings object at once. Keys are Latin and carry no ranges, so they stay untouched. */
export function typesetSettings<Settings>({ settings, locale }: { settings: Settings, locale: 'en' | 'ru' }): Settings {
  return JSON.parse(typeset({ text: JSON.stringify(settings), locale }))
}

/**
 * Typesets the text of a parsed Markdown tree in place, skipping code. In this tree format a node is
 * `[tag, props, ...children]` and text is a plain string. The stack keeps the walk free of recursion.
 */
export function typesetMarkdownNodes({ nodes, locale }: { nodes: unknown[], locale: 'en' | 'ru' }) {
  const pending: { siblings: unknown[], from: number }[] = [{ siblings: nodes, from: 0 }]

  for (let current = pending.pop(); current; current = pending.pop()) {
    const { siblings, from } = current
    for (let index = from; index < siblings.length; index++) {
      const node = siblings[index]
      if (typeof node === 'string') siblings[index] = typeset({ text: node, locale })
      else if (Array.isArray(node) && node[0] !== 'code' && node[0] !== 'pre') pending.push({ siblings: node, from: 2 })
    }
  }
}
