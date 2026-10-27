<script setup lang="ts">
const route = useRoute()
const { copy, locale, alternatePath } = useLocale()
/** The topbar names the current section; the home page and unknown paths use the home title. */
const sectionTitle = computed(() => {
  const titles: Record<string, string> = {
    about: copy.value.aboutSectionTitle,
    blog: copy.value.notebookTitle,
    work: copy.value.selectedWork,
    contact: copy.value.startConversation,
    recommendations: copy.value.recommendationsSectionTitle
  }
  const segment = route.path.replace(/^\/ru(?=\/|$)/, '').split('/')[1] || ''

  return titles[segment] || copy.value.homeSectionTitle
})
</script>

<template>
  <header class="page-topbar">
    <span>{{ sectionTitle }}</span>
    <div class="topbar-controls">
      <NuxtLink
        :to="alternatePath"
        class="language-link"
        :title="copy.switchLanguage"
        :lang="locale === 'en' ? 'ru' : 'en'"
        :hreflang="locale === 'en' ? 'ru' : 'en'"
      >{{ locale === 'en' ? 'RU' : 'EN' }}</NuxtLink>
      <ThemeToggle />
    </div>
  </header>
</template>
