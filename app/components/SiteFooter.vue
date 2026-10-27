<script setup lang="ts">
import profile from '~~/content/settings/profile.json'
import { SOURCE_REPOSITORY } from '~~/shared/site'

const { copy, localePath, locale } = useLocale()
const { buildYear } = useRuntimeConfig().public
</script>

<template>
  <footer class="site-footer">
    <span>© {{ buildYear }} {{ locale === 'ru' ? profile.name_ru : profile.name }}</span><NuxtLink :to="localePath('/privacy')" :title="copy.privacy">{{ copy.privacy }}</NuxtLink><a
      :href="SOURCE_REPOSITORY"
      target="_blank"
      rel="noopener noreferrer"
      :title="`${copy.sourceCode}, ${copy.opensInNewTab}`"
    >{{ copy.sourceCode }} ↗</a><span>{{ copy.tagline }}</span>
  </footer>
</template>
