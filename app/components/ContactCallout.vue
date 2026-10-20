<script setup lang="ts">
const { copy, localePath } = useLocale()
const siteContent = useSiteContent()
</script>

<template>
  <section class="contact-callout container" aria-labelledby="contact-callout-title">
    <div>
      <p class="eyebrow">
        {{ copy.letsTalk }}
      </p>
      <h2 id="contact-callout-title">
        {{ siteContent.cta.title }}
      </h2>
      <p class="text-muted">
        {{ siteContent.cta.body }}
      </p>
    </div>

    <NuxtLink :to="localePath('/contact')" class="button button-primary" :title="copy.letsTalk">
      {{ copy.letsTalk }} <AppIcon name="arrow" />
    </NuxtLink>
  </section>
</template>
