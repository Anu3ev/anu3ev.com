<script setup lang="ts">
const route = useRoute()
const { copy, locale, alternatePath } = useLocale()
const section = computed(() => {
  const sections: Record<string, { title: string, number: string }> = {
    blog: { title: copy.value.notebookTitle, number: '02' },
    work: { title: copy.value.selectedWork, number: '03' },
    contact: { title: copy.value.startConversation, number: '04' }
  }
  const segment = route.path.replace(/^\/ru(?=\/|$)/, '').split('/')[1] || ''

  return sections[segment] || { title: copy.value.homeSectionTitle, number: '01' }
})
</script>

<template>
  <header class="page-topbar">
    <span>{{ section.title }}</span>
    <div class="topbar-controls">
      <span class="page-number" aria-hidden="true">{{ section.number }} / 04</span>
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
