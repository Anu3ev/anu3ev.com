import { mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { readContentInventory } from './lib/content'
import { PROJECT_IMAGE_WIDTHS, projectImagePath } from '../shared/images'

/** This directory is generator-owned; rerun this step after changing cover files in a running dev session. */
const outputDirectory = 'public/images/responsive'
rmSync(outputDirectory, { recursive: true, force: true })

for (const { metadata } of readContentInventory().projects.filter(project => project.isPublic)) {
  for (const width of PROJECT_IMAGE_WIDTHS) {
    const destination = join('public', projectImagePath({ locale: metadata.locale, slug: metadata.slug, width }).slice(1))
    mkdirSync(dirname(destination), { recursive: true })
    await sharp(join('public', metadata.cover.slice(1))).resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toFile(destination)
  }
}

console.log('Prepared responsive project covers (640/960/1200px).')
