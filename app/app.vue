<script setup lang="ts">
import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import interCyrillic from '@fontsource-variable/inter/files/inter-cyrillic-wght-normal.woff2?url'

const { locale } = useLocale()
const { siteUrl } = useRuntimeConfig().public
/** Both font requests share the attributes required for anonymous font preload caching. */
const fontPreloadAttributes = { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' } as const

/** Vite returns relative asset URLs in SSR and absolute URLs in the browser; stable paths prevent duplicate hydration requests. */
const initialFontPreloads = [
  { ...fontPreloadAttributes, key: 'font-latin', href: new URL(interLatin, siteUrl).pathname },
  ...(locale.value === 'ru' ? [{ ...fontPreloadAttributes, key: 'font-cyrillic', href: new URL(interCyrillic, siteUrl).pathname }] : [])
]
useHead({ link: initialFontPreloads })
</script>

<template>
  <NuxtLoadingIndicator color="var(--accent)" />
  <NuxtRouteAnnouncer />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
