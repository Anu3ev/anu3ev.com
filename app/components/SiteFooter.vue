<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, localePath, locale } = useLocale()
const { buildYear } = useRuntimeConfig().public
</script>

<template>
  <footer class="site-footer">
    <span>© {{ buildYear }} {{ locale === 'ru' ? profile.name_ru : profile.name }}</span><NuxtLink :to="localePath('/privacy')" :title="copy.privacy">{{ copy.privacy }}</NuxtLink><span>{{ copy.tagline }}</span>
  </footer>
</template>
