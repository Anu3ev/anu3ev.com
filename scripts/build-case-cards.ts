import { mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { profileSchema, projectSchema } from '../shared/content-schema'
import { caseSocialImagePath } from '../shared/seo'
import { readEditorialSource } from './lib/content'
import { escapeXml } from './lib/xml'

/** The cover's place inside the frame of `og-case.svg`, inset by a pixel so the frame line stays visible. */
const COVER = { left: 591, top: 161, width: 544, height: 305, radius: 13 }

/** Title lines may run from the left margin up to a gap before the cover. */
const TITLE_MAX_WIDTH = COVER.left - 70 - 24

/** Title sizes from largest to smallest; a long title steps down until its lines fit in `maxLines`. */
const TITLE_SIZES = [
  { fontSize: 46, maxLines: 4 },
  { fontSize: 40, maxLines: 5 },
  { fontSize: 35, maxLines: 6 }
]

/** The small label above the title; the case's `context` (inSales, Open source…) follows it. */
const CASE_LABELS = { en: 'CASE STUDY', ru: 'КЕЙС' }

/**
 * The rendered width of one title line. It is measured with the same renderer that draws the card, because the
 * fallback sans-serif font differs between machines and Cyrillic runs wider than a character count suggests.
 */
async function measureLine({ line, fontSize }: { line: string, fontSize: number }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${fontSize * 2}"><text x="0" y="${fontSize * 1.5}" font-family="sans-serif" font-weight="600" font-size="${fontSize}">${escapeXml(line)}</text></svg>`
  const { info } = await sharp(Buffer.from(svg)).trim().toBuffer({ resolveWithObject: true })
  return info.width
}

/** Splits a title into lines of whole words that fit `TITLE_MAX_WIDTH`; a single longer word keeps its own line. */
async function wrapTitle({ title, fontSize }: { title: string, fontSize: number }) {
  const lines: string[] = []
  for (const word of title.split(' ')) {
    const lastLine = lines.at(-1)
    if (!lastLine) {
      lines.push(word)
      continue
    }

    const extended = `${lastLine} ${word}`
    if (await measureLine({ line: extended, fontSize }) <= TITLE_MAX_WIDTH) {
      lines[lines.length - 1] = extended
      continue
    }

    lines.push(word)
  }

  return lines
}

/** The largest size whose wrapped title fits; a title too long for every size fails instead of overflowing the card. */
async function layoutTitle(title: string) {
  for (const { fontSize, maxLines } of TITLE_SIZES) {
    const lines = await wrapTitle({ title, fontSize })
    if (lines.length <= maxLines) return { lines, fontSize }
  }

  throw new Error(`Case title is too long for its social card: ${title}`)
}

/** Title lines start under the label at the same baseline, so cards with short and long titles line up. */
async function titleSvg(title: string) {
  const { lines, fontSize } = await layoutTitle(title)
  const lineHeight = Math.round(fontSize * 1.17)
  return lines
    .map((line, index) => `<text x="70" y="${262 + index * lineHeight}" font-family="sans-serif" font-weight="600" font-size="${fontSize}" fill="#ecedee">${escapeXml(line)}</text>`)
    .join('\n  ')
}

/**
 * The cover cropped to the frame with rounded corners; SVG and WebP covers go through the same raster path. A cover with
 * a different shape keeps its top, where screenshots show the page header instead of a line cut in half.
 */
async function roundedCover(cover: string) {
  const { width, height, radius } = COVER
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}"/></svg>`
  return sharp(join('public', cover.slice(1)), { density: 144 })
    .resize(width, height, { fit: 'cover', position: 'top' })
    .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
    .png()
    .toBuffer()
}

/**
 * Draws a 1200 × 630 card for every published case in both languages: the site mark, the case label and title, the
 * author and the cover. Run it by hand after changing a case title or cover and commit the result; the content check
 * fails while a published case has no card.
 */
const profile = profileSchema.parse(JSON.parse(readFileSync('content/settings/profile.json', 'utf8')))
const template = readFileSync('scripts/assets/og-case.svg', 'utf8')
rmSync('public/images/og/work', { recursive: true, force: true })

for (const locale of ['en', 'ru'] as const) {
  const directory = join('content', locale, 'projects')
  const owner = locale === 'ru' ? profile.name_ru : profile.name

  for (const filename of readdirSync(directory).filter(name => name.endsWith('.md'))) {
    const source = `${locale}/projects/${filename}`
    const project = projectSchema.parse(readEditorialSource({ path: join(directory, filename), source }).data)
    if (!project.published) continue

    const card = template
      .replace('{{label}}', escapeXml(`${CASE_LABELS[locale]} · ${project.context.toUpperCase()}`))
      .replace('{{title}}', await titleSvg(project.title))
      .replace('{{owner}}', escapeXml(owner))
    const imagePath = join('public', caseSocialImagePath({ locale, slug: project.slug }).slice(1))
    mkdirSync(dirname(imagePath), { recursive: true })
    await sharp(Buffer.from(card))
      .composite([{ input: await roundedCover(project.cover), left: COVER.left, top: COVER.top }])
      .png()
      .toFile(imagePath)
    console.log(`Created ${imagePath}`)
  }
}
