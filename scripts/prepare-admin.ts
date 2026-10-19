import { copyFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/** Ship the lockfile-pinned CMS from this origin; no remote executable CDN is needed during admin login. */
const adminDirectory = fileURLToPath(new URL('../public/admin/', import.meta.url))
const cmsEntry = import.meta.resolve('@sveltia/cms')
mkdirSync(adminDirectory, { recursive: true })
copyFileSync(fileURLToPath(new URL('../dist/sveltia-cms.js', cmsEntry)), `${adminDirectory}cms.js`)
copyFileSync(fileURLToPath(new URL('../LICENSE.txt', cmsEntry)), `${adminDirectory}LICENSE.txt`)
console.log('Prepared the pinned Sveltia CMS browser bundle.')
