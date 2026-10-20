<script setup lang="ts">
const { copy, locale } = useLocale()
const siteContent = useSiteContent()
const updatedLabel = computed(() => new Intl.DateTimeFormat(locale.value, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(siteContent.value.privacy.updated)))
usePageSeo({ title: () => copy.value.privacy, description: () => siteContent.value.privacy.body })
</script>

<template>
  <div class="container">
    <header class="page-heading">
      <p class="eyebrow">
        {{ copy.privacy }}
      </p>
      <h1>{{ siteContent.privacy.title }}</h1>
      <p>{{ copy.updated }}: <time :datetime="siteContent.privacy.updated">{{ updatedLabel }}</time></p>
    </header>
    <div class="privacy-content page-content">
      <p>{{ siteContent.privacy.body }}</p>
      <p>{{ siteContent.privacy.contact }}</p>
      <p>{{ siteContent.privacy.storage }}</p>
      <a
        class="text-link"
        href="mailto:alexander.s.anufriev@gmail.com"
        :title="copy.emailMe"
      >alexander.s.anufriev@gmail.com <AppIcon name="arrow" /></a>
    </div>
  </div>
</template>
