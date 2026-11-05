<script setup lang="ts">
const { copy, locale, localePath, alternatePath } = useLocale()
</script>

<template>
  <header class="page-topbar">
    <NuxtLink :to="localePath('/')" class="topbar-brand" :title="copy.home">anu3ev.com</NuxtLink>
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
