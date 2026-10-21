import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { readContentInventory } from './scripts/lib/content'
import { createPublicPaths } from './scripts/lib/routes'
import { getSiteOrigin } from './shared/site'
import { getPublicationDate } from './shared/publication'

/** Public origin is a build-time setting so static metadata always matches the live host. */
const siteUrl = getSiteOrigin(process.env.NUXT_PUBLIC_SITE_URL)
const initialTheme = readFileSync(new URL('./app/assets/theme-init.js', import.meta.url), 'utf8')

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // `cover` lets the fixed mobile navigation reach the screen edge; its padding adds the safe-area inset itself.
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [{ name: 'theme-color', content: '#101216' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [{ key: 'initial-theme', innerHTML: initialTheme, tagPosition: 'head' }]
    }
  },
  css: ['~/assets/css/main.css'],
  content: { build: { markdown: { highlight: false } } },
  runtimeConfig: { public: { siteUrl, buildYear: getPublicationDate().slice(0, 4) } },
  experimental: { defaults: { nuxtLink: { prefetchOn: { interaction: true, visibility: false } } } },
  compatibilityDate: '2026-10-01',
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: createPublicPaths(readContentInventory())
    }
  },
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  debug: false,
  eslint: { config: { stylistic: { semi: false, quotes: 'single', commaDangle: 'never' } } }
})
