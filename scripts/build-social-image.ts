import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { defaultSocialImagePath } from '../shared/positioning'
import { profileSchema } from '../shared/content-schema'

/**
 * Draws the default social card with the current title. Run it by hand after changing the title and commit the result:
 * builds do not draw text because the hosting image may lack the fonts. The content check fails until the file exists.
 */
const profile = profileSchema.parse(JSON.parse(readFileSync('content/settings/profile.json', 'utf8')))
const svg = readFileSync('scripts/assets/og-default.svg', 'utf8').replace('{{headline_en}}', profile.headline_en)
const imagePath = join('public', defaultSocialImagePath(profile.headline_en).slice(1))

rmSync(dirname(imagePath), { recursive: true, force: true })
mkdirSync(dirname(imagePath), { recursive: true })
await sharp(Buffer.from(svg)).png().toFile(imagePath)
console.log(`Created ${imagePath}`)
