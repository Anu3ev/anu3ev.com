import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { execFileSync, spawn } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { stringify as stringifyYaml } from 'yaml'

/** Only application inputs are copied; Git, secrets, browser profiles and the user's working tree stay outside the fixture. */
function prepareFixture(root: string) {
  const inputs = ['app', 'content', 'public', 'shared', 'scripts', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'nuxt.config.ts', 'content.config.ts', 'tsconfig.json', 'eslint.config.mjs', '.npmrc', '.node-version', '.gitignore']
  for (const input of inputs) cpSync(input, join(root, input), { recursive: true })
  symlinkSync(join(process.cwd(), 'node_modules'), join(root, 'node_modules'), 'dir')

  const configPath = join(root, 'nuxt.config.ts')
  const config = readFileSync(configPath, 'utf8')
  if (!config.includes('export default defineNuxtConfig({')) throw new Error('Cannot isolate the Nuxt fixture build directory')
  writeFileSync(configPath, config.replace('export default defineNuxtConfig({', 'export default defineNuxtConfig({\n  buildDir: \'./.nuxt\','))

  writeFixtureArticles(root)
}

/** Synthetic article generation is separate from source/cache isolation, so content growth never changes this test. */
function writeFixtureArticles(root: string) {
  for (const locale of ['en', 'ru']) {
    const directory = join(root, 'content', locale, 'posts')
    rmSync(directory, { recursive: true, force: true })
    mkdirSync(directory, { recursive: true })

    for (let index = 1; index <= 12; index += 1) {
      const slug = `pagination-check-${String(index).padStart(2, '0')}`
      const body = `## Pagination fixture\n\n${'A temporary article used only to verify generated pagination. '.repeat(8)}`
      const metadata = {
        title: `Pagination fixture ${index}`, description: 'Temporary content for an isolated static generation test; this is never deployed.',
        locale, slug, published: true, date: `2026-10-${String(index).padStart(2, '0')}`,
        cover: '/images/vue-lifecycle.svg', coverAlt: 'Diagram used by an isolated pagination test',
        category: 'Fixture', readingMinutes: 1, tags: ['Pagination']
      }
      const document = `---\n${stringifyYaml(metadata)}---\n\n${body}`
      writeFileSync(join(directory, `${slug}.md`), document)
    }
  }
}

/** The temporary tree lives until its server stops; child build failures also release it. */
const root = mkdtempSync(join(tmpdir(), 'anu3ev-pagination-'))

try {
  prepareFixture(root)
  execFileSync('pnpm', ['build'], { cwd: root, stdio: 'inherit', env: { ...process.env, NUXT_PUBLIC_SITE_URL: 'https://pagination.example.test/' } })
  const server = spawn(process.execPath, [join(process.cwd(), 'node_modules/http-server/bin/http-server'), join(root, '.output/public'), '--port', '4174', '--address', '127.0.0.1', '-c-1'], { stdio: 'inherit' })

  server.once('exit', (code) => {
    rmSync(root, { recursive: true, force: true })
    process.exit(code ?? 0)
  })
  server.once('error', (error) => {
    rmSync(root, { recursive: true, force: true })
    console.error(error)
    process.exit(1)
  })
  process.once('SIGTERM', () => server.kill('SIGTERM'))
  process.once('SIGINT', () => server.kill('SIGINT'))
}
catch (error) {
  rmSync(root, { recursive: true, force: true })
  throw error
}
