<script setup lang="ts">
const { copy } = useLocale()
usePageSeo({ title: () => copy.value.privacy, description: () => copy.value.privacyBody })
</script>

<template>
  <div class="container">
    <header class="page-heading">
      <p class="eyebrow">
        {{ copy.privacy }}
      </p>
      <h1>{{ copy.privacyTitle }}</h1>
      <p>{{ copy.updated }}: <time datetime="2026-10-20">20.10.2026</time></p>
    </header>
    <div class="privacy-content page-content">
      <p>{{ copy.privacyBody }}</p>
      <p>{{ copy.privacyContact }}</p>
      <p>{{ copy.privacyStorage }}</p>
      <a
        class="text-link"
        href="mailto:alexander.s.anufriev@gmail.com"
        :title="copy.emailMe"
      >alexander.s.anufriev@gmail.com <AppIcon name="arrow" /></a>
    </div>
  </div>
</template>
