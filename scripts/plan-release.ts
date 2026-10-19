import { appendFileSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { z } from 'zod'
import { getReleaseTag } from './lib/releases'

const outputPath = process.env.GITHUB_OUTPUT
if (!outputPath) throw new Error('GITHUB_OUTPUT is required to plan a release')
if (process.env.GITHUB_EVENT_NAME !== 'push' || process.env.GITHUB_REF !== 'refs/heads/master') {
  throw new Error('Only a production branch push may plan a release')
}

const packageSchema = z.object({ version: z.string() })
const current = packageSchema.parse(JSON.parse(readFileSync('package.json', 'utf8')))
const previous = packageSchema.parse(JSON.parse(execFileSync('git', ['show', 'HEAD^:package.json'], { encoding: 'utf8' })))
const tag = getReleaseTag({ version: current.version, previousVersion: previous.version })
appendFileSync(outputPath, `tag=${tag}\n`)
console.info(tag ? `Release planned: ${tag}` : 'Content update: the package version has not changed')
