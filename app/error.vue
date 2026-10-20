<script setup lang="ts">
import type { NuxtError } from '#app'
import profile from '~~/content/settings/profile.json'

const { error } = defineProps<{ error: NuxtError }>()
const { copy, localePath, locale } = useLocale()
useSeoMeta({ title: () => `${error.statusCode} · ${locale.value === 'ru' ? profile.name_ru : profile.name}`, robots: 'noindex, follow' })
useHead(() => ({ htmlAttrs: { lang: locale.value } }))
</script>

<template>
  <NuxtLayout>
    <div class="container error-page">
      <span class="error-number">{{ error.statusCode }}</span>
      <h1>{{ copy.notFound }}</h1>
      <p>{{ copy.notFoundBody }}</p>
      <NuxtLink
        :to="localePath('/')"
        class="button button-primary"
        :title="copy.returnHome"
      >{{ copy.returnHome }} <AppIcon name="right" /></NuxtLink>
    </div>
  </NuxtLayout>
</template>
