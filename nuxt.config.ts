import tailwindcss from '@tailwindcss/vite'

/** Public origin is a build-time setting so static metadata always matches the live host. */
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://anu3ev-portfolio.vercel.app'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'theme-color', content: '#161513' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [{ src: '/theme.js', tagPosition: 'head' }]
    }
  },
  css: ['~/assets/css/main.css'],
  content: { build: { markdown: { highlight: false } } },
  runtimeConfig: { public: { siteUrl } },
  compatibilityDate: '2026-10-01',
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/ru', '/work', '/ru/work', '/blog', '/ru/blog', '/about', '/ru/about', '/contact', '/ru/contact', '/privacy', '/ru/privacy']
    }
  },
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  debug: false,
  eslint: { config: { stylistic: { semi: false, quotes: 'single', commaDangle: 'never' } } }
})
