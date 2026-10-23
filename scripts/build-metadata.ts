import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { z } from 'zod'
import { readContentInventory } from './lib/content'
import { createLlmsIndex, createPostMarkdown, createProjectMarkdown, markdownPath } from './lib/llms'
import { createPublicPaths } from './lib/routes'
import { canonicalPagePath, socialImagePath } from '../shared/seo'
import { getSiteOrigin } from '../shared/site'

/** XML text/attributes must remain data even when an editor writes angle brackets or ampersands. */
function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

const { projects, posts, profile, pages, certificates } = readContentInventory()
const origin = getSiteOrigin(process.env.NUXT_PUBLIC_SITE_URL)
const { version } = z.object({ version: z.string().regex(/^\d+\.\d+\.\d+$/) }).parse(JSON.parse(readFileSync('package.json', 'utf8')))
const commit = z.string().regex(/^[a-f0-9]{40}$/).nullable().parse(process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || null)
writeFileSync('public/version.json', `${JSON.stringify({ version, commit })}\n`)
const paths = createPublicPaths({ projects, posts })
const urls = paths.map(path => `<url><loc>${escapeXml(`${origin}${path}`)}</loc></url>`).join('\n')
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${origin}/sitemap.xml\n`)

rmSync('public/images/social', { recursive: true, force: true })

for (const locale of ['en', 'ru'] as const) {
  const prefix = locale === 'ru' ? '/ru' : ''
  const feedPath = `public${prefix}/rss.xml`
  const articles = posts.filter(post => post.isPublic && post.metadata.locale === locale).sort((first, second) => second.metadata.date.localeCompare(first.metadata.date) || first.metadata.slug.localeCompare(second.metadata.slug))
  const items = articles.map(({ metadata }) => {
    const url = `${origin}${canonicalPagePath(`${prefix}/blog/${metadata.slug}`)}`
    const date = new Date(`${metadata.date}T00:00:00+04:00`).toUTCString()
    return `<item>
      <title>${escapeXml(metadata.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(metadata.description)}</description>
      <pubDate>${date}</pubDate>
    </item>`
  }).join('\n')
  mkdirSync(dirname(feedPath), { recursive: true })
  const ownerName = locale === 'ru' ? profile.name_ru : profile.name
  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${ownerName} — ${pages[locale].blog.title}`)}</title>
    <link>${origin}${canonicalPagePath(`${prefix}/blog`)}</link>
    <description>${escapeXml(profile[`bio_${locale}`])}</description>
    <language>${locale}</language>
    <atom:link href="${origin}${prefix}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>
`
  writeFileSync(feedPath, feedXml)

  for (const { metadata } of articles) {
    const imagePath = join('public', socialImagePath({ locale, slug: metadata.slug }).slice(1))
    mkdirSync(dirname(imagePath), { recursive: true })
    await sharp(join('public', metadata.cover.slice(1))).resize(1200, 630, { fit: 'cover' }).png().toFile(imagePath)
  }
}

/** Generated machine-readable copies live under these public paths; they are rebuilt from content on every build. */
for (const generated of ['public/llms.txt', 'public/llms-full.txt', 'public/ru/llms.txt', 'public/ru/llms-full.txt', 'public/work', 'public/blog', 'public/ru/work', 'public/ru/blog']) {
  rmSync(generated, { recursive: true, force: true })
}

/** For AI answer engines: an llms.txt index per language, a Markdown copy beside every case and article, and one full-text file. */
for (const locale of ['en', 'ru'] as const) {
  const prefix = locale === 'ru' ? '/ru' : ''
  const localeProjects = projects.filter(project => project.isPublic && project.metadata.locale === locale).sort((first, second) => first.metadata.order - second.metadata.order)
  const localePosts = posts.filter(post => post.isPublic && post.metadata.locale === locale).sort((first, second) => second.metadata.date.localeCompare(first.metadata.date) || first.metadata.slug.localeCompare(second.metadata.slug))
  const projectFiles = localeProjects.map(project => ({ path: markdownPath(`${prefix}/work/${project.metadata.slug}`), markdown: createProjectMarkdown({ project, origin }) }))
  const postFiles = localePosts.map(post => ({ path: markdownPath(`${prefix}/blog/${post.metadata.slug}`), markdown: createPostMarkdown({ post, origin }) }))

  for (const { path, markdown } of [...projectFiles, ...postFiles]) {
    mkdirSync(dirname(`public${path}`), { recursive: true })
    writeFileSync(`public${path}`, markdown)
  }

  const index = createLlmsIndex({
    locale, origin, profile, pages, certificates,
    projects: localeProjects.map(project => project.metadata),
    posts: localePosts.map(post => post.metadata)
  })
  mkdirSync(`public${prefix}`, { recursive: true })
  writeFileSync(`public${prefix}/llms.txt`, index)
  writeFileSync(`public${prefix}/llms-full.txt`, [index, ...projectFiles.map(file => file.markdown), ...postFiles.map(file => file.markdown)].join('\n---\n\n'))
}

const favicon = readFileSync('public/favicon.svg')
for (const [size, filename] of [[48, 'favicon-48.png'], [180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']] as const) {
  await sharp(favicon).resize(size, size).png().toFile(`public/${filename}`)
}
writeFileSync('public/site.webmanifest', JSON.stringify({ name: profile.name, short_name: 'anu3ev', start_url: '/', display: 'browser', background_color: '#101216', theme_color: '#101216', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2))
console.log(`Generated sitemap (${paths.length} pages), EN/RU RSS and llms.txt, Markdown copies, social cards, manifest and icons for ${origin}.`)
