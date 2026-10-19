<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{ error: NuxtError }>()
const { copy, localePath, locale } = useLocale()
useSeoMeta({ title: '404 · Alexander Anufriev', robots: 'noindex, follow' })
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
