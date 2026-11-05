import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const FONT_DIRECTORY = 'node_modules/@fontsource-variable/inter/files'

/** An SVG shown through `<img>` cannot use the page's fonts, so a diagram carries Inter inside the file. */
function fontFace(subset: 'latin' | 'cyrillic') {
  const font = readFileSync(join(FONT_DIRECTORY, `inter-${subset}-wght-normal.woff2`)).toString('base64')
  return `@font-face{font-family:Inter;font-weight:100 900;src:url(data:font/woff2;base64,${font}) format('woff2')}`
}

/** Every SVG under a directory; the depth of `public/images` is small and the walk uses a plain stack. */
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

for (const path of findSvgFiles('public/images')) {
  const svg = readFileSync(path, 'utf8')
  if (!svg.includes('<text') || svg.includes('@font-face')) continue

  const faces = [fontFace('latin'), ...(/\p{Script=Cyrillic}/u.test(svg) ? [fontFace('cyrillic')] : [])]
  writeFileSync(path, svg.replace(/(<svg\b[^>]*>)/, `$1<style>${faces.join('')}</style>`))
  console.log(`Embedded Inter in ${path}`)
}
