import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { z } from 'zod'
import pages from '../../content/settings/pages.json'
import { recommendationSchema } from '../../shared/content-schema'

const fieldNames = z.array(z.object({ name: z.string() }))
const group = z.object({ name: z.string(), widget: z.enum(['object', 'list']), fields: z.array(z.unknown()) })
const settingsFile = z.object({ name: z.string(), file: z.string(), fields: z.array(z.unknown()) })
const configSchema = z.object({ collections: z.array(z.object({ name: z.string(), files: z.array(settingsFile).optional() })) })

describe('CMS settings contract', () => {
  it('exposes every page group, About field and career property in both expanded language forms', () => {
    const input: unknown = parse(readFileSync('public/admin/config.yml', 'utf8'))
    const config = configSchema.parse(input)
    const settings = config.collections.find(collection => collection.name === 'settings')
    const file = settingsFile.parse(settings?.files?.find(file => file.name === 'pages'))
    expect(file.file).toBe('content/settings/pages.json')

    const locales = z.array(group.extend({ name: z.enum(['en', 'ru']) })).parse(file.fields)
    expect(locales.map(locale => locale.name)).toEqual(['en', 'ru'])
    expect(locales[0]?.fields).toEqual(locales[1]?.fields)

    for (const locale of locales) {
      const groups = z.array(group).parse(locale.fields)
      expect(groups.map(section => section.name).sort()).toEqual(Object.keys(pages[locale.name]).sort())
      const about = group.parse(groups.find(section => section.name === 'about'))
      expect(fieldNames.parse(about.fields).map(field => field.name).sort()).toEqual(Object.keys(pages[locale.name].about).sort())
      const experience = group.parse(about.fields.find(field => z.object({ name: z.string() }).parse(field).name === 'experience'))
      expect(experience.widget).toBe('list')
      expect(fieldNames.parse(experience.fields).map(field => field.name).sort()).toEqual(['company', 'description', 'end', 'role', 'start'])
      const home = group.parse(groups.find(section => section.name === 'home'))
      expect(fieldNames.parse(home.fields).map(field => field.name).sort()).toEqual(Object.keys(pages[locale.name].home).sort())
      const highlights = group.parse(home.fields.find(field => z.object({ name: z.string() }).parse(field).name === 'highlights'))
      expect(highlights.widget).toBe('list')
      expect(fieldNames.parse(highlights.fields).map(field => field.name).sort()).toEqual(['label', 'value'])
      const portfolio = group.parse(groups.find(section => section.name === 'portfolio'))
      expect(fieldNames.parse(portfolio.fields).map(field => field.name).sort()).toEqual(Object.keys(pages[locale.name].portfolio).sort())
      const summary = group.parse(portfolio.fields.find(field => z.object({ name: z.string() }).parse(field).name === 'summary'))
      expect(summary.widget).toBe('list')
      expect(fieldNames.parse(summary.fields).map(field => field.name).sort()).toEqual(['label', 'value'])
    }
  })

  it('edits every recommendation field the schema accepts, plus the filename slug and the text', () => {
    const input: unknown = parse(readFileSync('public/admin/config.yml', 'utf8'))
    const collections = z.object({ collections: z.array(z.object({ name: z.string(), folder: z.string().optional(), fields: z.array(z.unknown()).optional() })) }).parse(input).collections
    const recommendations = collections.find(collection => collection.name === 'recommendations')
    expect(recommendations?.folder).toBe('content/recommendations')

    const names = fieldNames.parse(recommendations?.fields).map(field => field.name)
    expect(names.filter(name => !['slug', 'body'].includes(name)).sort()).toEqual(Object.keys(recommendationSchema.shape).sort())
  })
})
