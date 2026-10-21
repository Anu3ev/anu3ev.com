<script setup lang="ts">
const route = useRoute()
const { copy, locale, alternatePath } = useLocale()
const section = computed(() => {
  const sections: Record<string, { title: string, number: string }> = {
    about: { title: copy.value.aboutSectionTitle, number: '02' },
    blog: { title: copy.value.notebookTitle, number: '03' },
    work: { title: copy.value.selectedWork, number: '04' },
    contact: { title: copy.value.startConversation, number: '05' }
  }
  const segment = route.path.replace(/^\/ru(?=\/|$)/, '').split('/')[1] || ''

  return sections[segment] || { title: copy.value.homeSectionTitle, number: '01' }
})
</script>

<template>
  <header class="page-topbar">
    <span>{{ section.title }}</span>
    <div class="topbar-controls">
      <span class="page-number" aria-hidden="true">{{ section.number }} / 05</span>
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
