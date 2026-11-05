<script setup lang="ts">
import { formatDay } from '~~/shared/page-content'
import profile from '~~/content/settings/profile.json'

const { copy, locale } = useLocale()
const siteContent = useSiteContent()
const updatedLabel = computed(() => formatDay({ value: siteContent.value.privacy.updated, locale: locale.value }))
usePageSeo({ title: () => copy.value.privacy, description: () => siteContent.value.privacy.body })
</script>

<template>
  <div class="container">
    <header class="page-heading">
      <h1>{{ siteContent.privacy.title }}</h1>
      <p>{{ copy.updated }}: <time :datetime="siteContent.privacy.updated">{{ updatedLabel }}</time></p>
    </header>
    <div class="privacy-content page-content">
      <p>{{ siteContent.privacy.body }}</p>
      <p>{{ siteContent.privacy.contact }}</p>
      <p>{{ siteContent.privacy.storage }}</p>
      <a
        class="text-link"
        :href="`mailto:${profile.email}`"
        :title="copy.emailMe"
      >{{ profile.email }} <AppIcon name="arrow" /></a>
    </div>
  </div>
</template>
